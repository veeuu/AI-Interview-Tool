from flask import Flask, request, jsonify
import google.generativeai as genai
from flask_cors import CORS

# Initialize Flask
app = Flask(__name__)
CORS(app)  # allow requests from frontend

# Configure Gemini API
genai.configure(api_key="AIzaSyCp6NxWgP296VMmO90xb1UbKyKatXorZ3Q")

# Load model
model = genai.GenerativeModel("gemini-1.5-flash")

@app.route("/ask", methods=["GET", "POST"])
def ask_ai():
    try:
        data = request.get_json()
        question = data.get("question", "")

        if not question:
            return jsonify({"error": "No question provided"}), 400

        # Get AI response
        response = model.generate_content(question)
        answer = response.text.strip()

        return jsonify({"answer": answer})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
