from fastapi import APIRouter
from openai import OpenAI
from dotenv import load_dotenv
from pathlib import Path
import os

load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

router = APIRouter(prefix="/chatbot", tags=["chatbot"])


@router.post("")
async def chatbot(data: dict):
    user_message = data.get("message", "")
    chat_history = data.get("messages", [])
    risk_level = data.get("risk_level", "unknown")
    risk_percentage = data.get("risk_percentage", 0)
    patient_data = data.get("patient_data", {})

    # Son kullanıcı mesajını al
    if chat_history:
        last_user = [m for m in chat_history if m.get("role") == "user"]
        if last_user:
            user_message = last_user[-1].get("content", user_message)

    # 1. Acil belirti kontrolü
    emergency = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "Sen bir acil belirti kontrolcüsüsün.\n"
                    "Kullanıcının mesajında inme/felç açısından acil değerlendirme "
                    "gerektirebilecek belirti olup olmadığını kontrol et.\n\n"
                    "Acil olabilecek durumlar:\n"
                    "- yüz kayması\n- konuşma bozukluğu\n- kol veya bacakta güçsüzlük\n"
                    "- uyuşma\n- ani görme kaybı\n- denge kaybı\n"
                    "- ani şiddetli baş dönmesi\n- bir tarafın tutmaması\n\n"
                    "Sadece şu iki cevaptan birini ver:\nEMERGENCY\nNOT_EMERGENCY"
                ),
            },
            {"role": "user", "content": user_message},
        ],
    )
    if emergency.choices[0].message.content.strip() == "EMERGENCY":
        return {
            "response": (
                "⚠️ Bu belirtiler acil değerlendirme gerektirebilir. "
                "En kısa sürede acil sağlık hizmetine (112) başvurmanız önerilir. "
                "Bu sistem kesin tanı koymaz; profesyonel sağlık desteği alınmalıdır."
            )
        }

    # 2. Konu kapsamı kontrolü
    scope = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "Sen bir konu kapsamı kontrolcüsüsün. "
                    "Kullanıcının sorusunun stroke/inme risk sistemiyle ilgili olup olmadığını belirle.\n\n"
                    "İlgili konular: inme, felç, stroke, sağlık verileri, tansiyon, glukoz, BMI, "
                    "sigara, hipertansiyon, kalp hastalığı, risk sonucu, sağlıklı yaşam, "
                    "egzersiz, beslenme, doktor kontrolü, sistemin kullanımı, selamlama.\n\n"
                    "Konu dışı: üniversite, spor kulübü, teknoloji, para, seyahat, eğlence.\n\n"
                    "Sadece şu iki cevaptan birini ver:\nIN_SCOPE\nOUT_OF_SCOPE"
                ),
            },
            {"role": "user", "content": user_message},
        ],
    )
    if scope.choices[0].message.content.strip() != "IN_SCOPE":
        return {
            "response": (
                "Bu sistemde yalnızca inme riski, sağlık verilerinizin anlamı "
                "ve risk azaltma önerileri konusunda yardımcı olabilirim."
            )
        }

    # 3. Ana yanıt
    age             = patient_data.get("age", "belirtilmedi")
    avg_glucose     = patient_data.get("avg_glucose_level", "belirtilmedi")
    bmi             = patient_data.get("bmi", "belirtilmedi")
    smoking         = patient_data.get("smoking_status", "belirtilmedi")
    hypertension    = patient_data.get("hypertension", "belirtilmedi")
    heart_disease   = patient_data.get("heart_disease", "belirtilmedi")

    system_prompt = f"""Sen StrokePredict AI içinde çalışan yardımcı bir sağlık asistanısın.

Hastanın analiz sonuçları:
- Risk seviyesi: {risk_level}
- Risk yüzdesi: %{risk_percentage}

Hasta verileri:
- Yaş: {age}
- Glikoz seviyesi: {avg_glucose}
- BMI: {bmi}
- Sigara kullanımı: {smoking}
- Hipertansiyon: {hypertension}
- Kalp hastalığı: {heart_disease}

Kurallar:
- Türkçe cevap ver, kısa ve bilgilendirici ol
- Kesinlikle teşhis koyma, ilaç önerme
- Düşük riskin sıfır risk olmadığını gerektiğinde belirt
- Yüksek riskte mutlaka doktor kontrolünü öner
- Kullanıcıyı gereksiz korkutma
- Sağlıklı yaşam önerileri ver"""

    messages_for_openai = [{"role": "system", "content": system_prompt}]
    if chat_history:
        messages_for_openai.extend(chat_history)
    else:
        messages_for_openai.append({"role": "user", "content": user_message})

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=messages_for_openai,
    )

    return {"response": response.choices[0].message.content}
