from flask import Flask, render_template, request
import os
import openai
import docx
import PyPDF2
from collections import namedtuple

app = Flask(__name__)

openai.api_key = os.getenv("OPENAI_API_KEY")
CPARTY, ORG = None, None


def gpt_backend(background_info):
    prompt = f"""Task:
Given the context, the given counterparty and our organization, and three aspects that need to be addressed, please summarize the 1) position, 2) reasoning, and 3) motive and values for both parties, in the format of bullet points for each aspect. 

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

    return completion.choices[0].message.content


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/next_page", methods=["POST"])
def next_page():
    counterparty = request.form["counterparty"]
    organization = request.form["organization"]
    CPARTY = counterparty
    ORG = organization
    return render_template(
        "next_page.html", counterparty=counterparty, organization=organization
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
            counterparty=CPARTY,
            organization=ORG,
            content=msg,
        )
        res = gpt_backend(bi)
        return render_template("result_page.html", result=res)
    else:
        return "No file selected."


if __name__ == "__main__":
    app.run(debug=True)