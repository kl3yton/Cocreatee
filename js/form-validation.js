// ===========================================================
// MÁSCARA DE TELEFONE E VALIDAÇÃO DO FORMULÁRIO (com EmailJS)
// ===========================================================

document.addEventListener('DOMContentLoaded', function() {
    const telefoneInput = document.getElementById('telefone');
    const form = document.getElementById('contactForm');
    
    // Máscara de telefone brasileira
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let valor = this.value.replace(/\D/g, '');
            
            // Limita a 11 dígitos
            if (valor.length > 11) {
                valor = valor.slice(0, 11);
            }
            
            // Formatação (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
            if (valor.length > 10) {
                this.value = valor.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (valor.length > 6) {
                this.value = valor.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
            } else if (valor.length > 2) {
                this.value = valor.replace(/(\d{2})(\d{0,5})/, '($1) $2');
            } else if (valor.length > 0) {
                this.value = valor.replace(/(\d*)/, '($1');
            }
        });
    }

    // ---- Helpers de validação inline ----
    function showFieldError(field, message) {
        clearFieldError(field);
        field.classList.add('field-invalid');
        const span = document.createElement('span');
        span.className = 'field-error';
        span.textContent = message;
        field.parentElement.appendChild(span);
    }

    function clearFieldError(field) {
        field.classList.remove('field-invalid');
        const existing = field.parentElement.querySelector('.field-error');
        if (existing) existing.remove();
    }

    function clearAllErrors() {
        if (!form) return;
        form.querySelectorAll('.field-invalid').forEach(f => f.classList.remove('field-invalid'));
        form.querySelectorAll('.field-error').forEach(s => s.remove());
    }

    // Limpar erro ao digitar
    if (form) {
        form.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('input', () => clearFieldError(field));
        });
    }

    // ---- Envio do formulário ----
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            clearAllErrors();
            
            const nome = this.querySelector('#nome');
            const telefone = this.querySelector('#telefone');
            const email = this.querySelector('#email');
            const mensagem = this.querySelector('#mensagem');
            let hasError = false;
            
            // Validação
            if (!nome.value.trim() || nome.value.trim().length < 3) {
                showFieldError(nome, 'Insira um nome válido (mínimo 3 caracteres).');
                hasError = true;
            }
            
            const telefoneDigits = telefone.value.replace(/\D/g, '');
            if (telefoneDigits.length < 10 || telefoneDigits.length > 11) {
                showFieldError(telefone, 'Insira um telefone válido com DDD.');
                hasError = true;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value.trim())) {
                showFieldError(email, 'Insira um e-mail válido.');
                hasError = true;
            }
            
            if (!mensagem.value.trim() || mensagem.value.trim().length < 10) {
                showFieldError(mensagem, 'Escreva pelo menos 10 caracteres.');
                hasError = true;
            }
            
            if (hasError) return;

            // ---- Envio via EmailJS ----
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Enviando...';
            submitBtn.disabled = true;

            // TODO: Substitua os valores abaixo pelos seus IDs do EmailJS
            // 1. Crie uma conta em https://www.emailjs.com/
            // 2. Crie um serviço (Gmail, Outlook, etc.)
            // 3. Crie um template com variáveis: {{nome}}, {{telefone}}, {{email}}, {{mensagem}}
            // 4. Copie o Service ID, Template ID e Public Key abaixo:
            const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
            const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
            const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';

            // Verifica se EmailJS está carregado e configurado
            if (typeof emailjs !== 'undefined' && EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID') {
                emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                    nome: nome.value.trim(),
                    telefone: telefone.value.trim(),
                    email: email.value.trim(),
                    mensagem: mensagem.value.trim()
                }, EMAILJS_PUBLIC_KEY)
                .then(() => {
                    showFormSuccess(this, submitBtn, originalHTML);
                })
                .catch((err) => {
                    console.error('EmailJS error:', err);
                    showFormError(submitBtn, originalHTML);
                });
            } else {
                // Fallback: redireciona para WhatsApp com dados preenchidos
                const text = encodeURIComponent(
                    `Olá! Sou ${nome.value.trim()}.\n` +
                    `Telefone: ${telefone.value.trim()}\n` +
                    `E-mail: ${email.value.trim()}\n\n` +
                    `${mensagem.value.trim()}`
                );
                window.open(`https://wa.me/558391041513?text=${text}`, '_blank');
                showFormSuccess(this, submitBtn, originalHTML);
            }
        });
    }

    function showFormSuccess(formEl, btn, originalHTML) {
        formEl.reset();
        const contador = document.getElementById('contador');
        if (contador) contador.textContent = '0 / 256';
        
        btn.innerHTML = '<i class="bi bi-check-circle-fill"></i> Enviado com sucesso!';
        btn.classList.add('btn-success');
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
            btn.classList.remove('btn-success');
        }, 3000);
    }

    function showFormError(btn, originalHTML) {
        btn.innerHTML = '<i class="bi bi-x-circle-fill"></i> Erro ao enviar';
        btn.classList.add('btn-error');
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
            btn.classList.remove('btn-error');
        }, 3000);
    }
});

