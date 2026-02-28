window.onerror = (msg) => alert("Erreur : " + msg);
const hfToken = process.env.HF_TOKEN;

// Cette fonction attend que la page soit 100% chargée
window.addEventListener('load', function() {
    
    const imageInput = document.getElementById('imageInput');
    const preview = document.getElementById('preview');
    const generateBtn = document.getElementById('generateBtn');
    const placeholder = document.getElementById('placeholder-text');
    let tenueChoisie = "";

    // VERIFICATION : Si un élément manque, on le dit tout de suite
    if (!imageInput) return alert("ERREUR : L'élément 'imageInput' est introuvable dans le HTML");
    if (!preview) return alert("ERREUR : L'élément 'preview' est introuvable");

    // 1. GESTION DE LA PHOTO
    imageInput.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                preview.src = event.target.result;
                preview.style.display = 'block';
                if (placeholder) placeholder.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    };

    // 2. SÉLECTION DE LA TENUE
    document.querySelectorAll('.style-btn').forEach(btn => {
        btn.onclick = function() {
            document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            tenueChoisie = this.innerText;
        };
    });

    // 3. GÉNÉRATION IA
    generateBtn.onclick = async function() {
        if (!preview.src || preview.style.display === 'none') return alert("Choisis une photo !");
        if (!tenueChoisie) return alert("Choisis une tenue !");

        generateBtn.innerText = "⏳ IA en cours...";
        generateBtn.disabled = true;

        try {
            const response = await fetch(
                "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
                {
                    headers: { 
                        "Authorization": `Bearer ${HF_TOKEN}`,
                        "Content-Type": "application/json"
                    },
                    method: "POST",
                    body: JSON.stringify({ 
                        inputs: `A professional portrait of a person wearing a luxury ${tenueChoisie}, ramadan style, high quality`,
                        options: { "wait_for_model": true }
                    }),
                }
            );

            if (!response.ok) throw new Error("Erreur Serveur (Vérifie ton Token)");

            const resultBlob = await response.blob();
            preview.src = URL.createObjectURL(resultBlob);
            alert("✨ C'est prêt !");

        } catch (error) {
            alert("❌ " + error.message);
        } finally {
            generateBtn.innerText = "Générer ma photo ✨";
            generateBtn.disabled = false;
        }
    };
});
