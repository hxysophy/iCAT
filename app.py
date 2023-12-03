from flask import Flask, render_template, request, session
import os
import openai
import docx
import PyPDF2
from collections import namedtuple

app = Flask(__name__)
app.secret_key = "hihi"

openai.api_key = os.getenv("OPENAI_API_KEY")


def gpt_backend(background_info):
    prompt = f"""Task: 
Given the context, counterparty and our organization, and three aspects that need to be addressed, please summarize the 1) position, 2) reasoning, and 3) motive and values for both parties.

With respect to counterparty, you should follow the logic of 1) articulate positions (what); 2) assess the tactical reasoning in support of positions from 1 (how); 3) inner motives and values behind the reasoning from 2 (why). With respect to our organization, you should follow a reversed logic, starting from motives and values (why), to reasoning (how), and to positions (what).

Next, interpret and summarize the convergent elements and divergent elements between both parties and list them separately into:1) positions (what), 2) tactical reasoning in support of positions from 1 (how), 3) motives and values behind the reasoning from 2 (why)

All are in the format of bullet points for each aspect.

You may refer to the following questions to guide your summary. Make sure your summary is coherent with the context provided.

Guiding questions:
With respect to counterparty:
1) Position:
What are the counterparty’s explicit positions (e.g., priorities and objectives)?
What are the counterparty’s implicit positions (e.g., attitude towards our organization, to what extent does the counterparty want to work with our organization)?
2) Tactical Reasoning:
Given the position derived above, what could be an explanation of the tactical reasoning of the counterpart to understand where they want to go with their position?
3) Motives, Values & Identify:
Why does the counterparty take such positions? What are their inner motives and values?
What are the identity and cultural norms at play in the position of the counterpart and on which the counterpart often has little control?

With respect to our organization:
1) Motives, Values & Identify:
Think about our identity, what are our inner principles, motives, and values?
Why does our organization hope to operate in this particular context?
2) Tactical Reasoning:
How do we intend to operate to ensure our goal is fulfilled and reach a maximized utility?
3) Position:
What does our organization want out of this negotiation?
What is our offer of service? 
What is the best-case scenario of an agreement with the counterparty? Under what terms does our organization wish to operate?



Context:
{background_info.content}

Counterparty: {background_info.counterparty}
Our organization: {background_info.organization}
"""

    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": "You are a expert in negotiation, skilled in handling conflicts and difficult situations. You are a master of the art of persuasion.",
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
    )
    raw_content = completion.choices[0].message.content
    second_completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "user",
                "content": f"Please parse the following string into a two-level json string. The three outer-most keys are [{background_info.counterparty}], [{background_info.organization}], [convergent and divergent elements] . The three inner-most keys are [Position], [Tactical Reasoning], [Values & Motives].: {raw_content}",
            }
        ],
    )

    return second_completion.choices[0].message.content


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/next_page", methods=["POST"])
def next_page():
    session["counterparty"] = request.form["counterparty"]
    session["organization"] = request.form["organization"]

    return render_template(
        "next_page.html",
        counterparty=session["counterparty"],
        organization=session["organization"],
    )


@app.route("/process_data", methods=["POST"])
def process_data():
    uploaded_file = request.files["fileUpload"]
    bg_info = namedtuple("bg_info", ["counterparty", "organization", "content"])

    if uploaded_file.filename != "":
        if uploaded_file.filename.endswith(".docx"):
            doc = docx.Document(uploaded_file)
            content = [p.text for p in doc.paragraphs]
        elif uploaded_file.filename.endswith(".pdf"):
            pdf = PyPDF2.PdfReader(uploaded_file)
            content = []
            for page_num in range(len(pdf.pages)):
                content.append(pdf.pages[page_num].extract_text())
        else:
            return "Invalid file type. Please upload a DOCX or PDF file."
        msg = "".join(content)
        bi = bg_info(
            counterparty=session["counterparty"],
            organization=session["organization"],
            content=msg,
        )
        json_data = gpt_backend(bi)
        return render_template("result_page.html", json_data=json_data)
    else:
        return "No file selected."


if __name__ == "__main__":
    app.run(debug=True)
