from flask import Flask, request
import os
import openai
import docx
import PyPDF2


app = Flask(__name__)


openai.api_key = os.getenv("OPENAI_API_KEY")


def gpt_backend(background_info):
    prompt = f"""Task:
Given the context, the given counterparty and our organization, and three aspects that need to be addressed, please summarize the 1) position, 2) reasoning, and 3) motive and values for both parties, in the format of bullet points for each aspect. 

Context:
{background_info}

Counterparty: Camp authorities
Our organization: FWB
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
    return open("index.html").read()


@app.route("/upload", methods=["POST"])
def process1():
    uploaded_file = request.files["file_input"]

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
        return gpt_backend(msg)
    else:
        return "No file selected."


@app.route("/text_input", methods=["POST"])
def process2():
    user_input = request.form["user_input"]
    return gpt_backend(user_input)


if __name__ == "__main__":
    app.run(debug=True)
