from flask import Flask, request, jsonify
import google.generativeai as genai
from flask_cors import CORS
from dotenv import load_dotenv
import os


load_dotenv()


app = Flask(__name__)
CORS(app)  

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-1.5-flash")

@app.route("/ask", methods=["POST"])
def ask_ai():
    try:
        data = request.get_json()
        question = data.get("question", "")
        length = data.get("length", "balanced") 

        if not question:
            return jsonify({"error": "No question provided"}), 400

        prompt = f"{question}\nPlease respond in a {length} format."
        
        if "(Provide Examples)" in question:
            prompt += "\nAlso provide real-world examples."
        elif "(Provide Point-wise explanation)" in question:
            prompt += "\nProvide the answer in concise bullet points."
        elif "(Provide Detailed explanation)" in question:
            prompt += "\nProvide a more detailed, in-depth explanation."

        response = model.generate_content(prompt)
        answer = response.text.strip()

        return jsonify({"answer": answer})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
