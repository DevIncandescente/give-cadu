/* ==========================================================================
   SCRIPT.JS - LÓGICA GERAL DO SITE CADO
   ========================================================================== */

// --- 1. BUSCA (SEARCH) ---
// Mantemos global para funcionar com o onclick="" do HTML se houver
function toggleSearch() {
    const searchBox = document.getElementById('searchBox');
    const searchInput = document.getElementById('searchInput');

    if (searchBox && searchInput) {
        searchBox.classList.toggle('active');
        if (searchBox.classList.contains('active')) {
            searchInput.focus();
        }
    }
}

async function copyCadoText(text) {
    try {
        await navigator.clipboard.writeText(text);
    } catch (error) {
        const helper = document.createElement('textarea');
        helper.value = text;
        helper.style.position = 'fixed';
        helper.style.opacity = '0';
        document.body.appendChild(helper);
        helper.select();
        document.execCommand('copy');
        helper.remove();
    }
}

function initializeHostShareModal(shareModal) {
    const shareBox = shareModal.querySelector('.share-modal-box');
    const shareHeader = shareBox?.querySelector('.modal-header');
    const shareGrid = shareBox?.querySelector('.share-options-grid');
    const copyLinkArea = shareBox?.querySelector('.copy-link-area');
    const shortCelebrationUrl = 'https://cado.com/mauro-5';
    const defaultShareMessage = "Hi! We'd love you to join us for Mauro's celebration.\n\nYou can see the details, RSVP and be part of the gift here:";

    if (!shareBox || !shareHeader || !shareGrid || !copyLinkArea) return;

    if (!document.getElementById('shareMessage')) {
        shareHeader.insertAdjacentHTML('afterend', `
            <div class="share-compose-field">
                <label for="shareMessage">Message</label>
                <textarea id="shareMessage" class="modal-input" rows="4">${defaultShareMessage}</textarea>
                <small>Edit the message before choosing where to share it.</small>
            </div>
        `);
    }

    shareGrid.innerHTML = `
        <button type="button" class="share-option-btn whatsapp" data-share-channel="whatsapp"><i class="fa-brands fa-whatsapp"></i> WhatsApp</button>
        <button type="button" class="share-option-btn email" data-share-channel="email"><i class="fa-regular fa-envelope"></i> Email</button>
        <button type="button" class="share-option-btn messages" data-share-channel="sms"><i class="fa-regular fa-message"></i> Messages</button>
        <button type="button" class="share-option-btn copy" data-share-channel="copy"><i class="fa-regular fa-copy"></i> Copy message</button>
    `;

    const shareUrlInput = document.getElementById('shareUrl');
    const copyBtn = document.getElementById('copyBtn');
    if (shareUrlInput) shareUrlInput.value = shortCelebrationUrl;

    if (!document.getElementById('shareQrCanvas')) {
        copyLinkArea.insertAdjacentHTML('afterend', `
            <section class="share-qr-panel" aria-labelledby="shareQrHeading">
                <div class="share-qr-copy">
                    <span class="share-panel-kicker">Printable invitation</span>
                    <h3 id="shareQrHeading">QR code and invite</h3>
                    <p>Choose a simple style, then download the QR code or a ready-to-print invitation.</p>
                    <label for="inviteTheme">Invitation style</label>
                    <select id="inviteTheme" class="modal-input">
                        <option value="playful">Playful</option>
                        <option value="classic">Classic</option>
                        <option value="minimal">Minimal</option>
                    </select>
                    <div class="share-download-actions">
                        <button type="button" class="btn-cta-secondary" id="downloadQrBtn"><i class="fa-solid fa-qrcode"></i> Download QR</button>
                        <button type="button" class="btn-cta-secondary" id="downloadInviteBtn"><i class="fa-regular fa-image"></i> Download invite</button>
                        <button type="button" class="btn-cta" id="printInviteBtn"><i class="fa-solid fa-print"></i> Print / Save PDF</button>
                    </div>
                </div>
                <div class="share-preview-stack">
                    <canvas id="shareQrCanvas" width="180" height="180" aria-label="Celebration QR code"></canvas>
                    <canvas id="invitePreviewCanvas" width="900" height="1200" aria-label="Printable invitation preview"></canvas>
                </div>
            </section>
            <p class="share-feedback" id="shareFeedback" role="status" aria-live="polite"></p>
        `);
    }

    const shareMessageInput = document.getElementById('shareMessage');
    const shareQrCanvas = document.getElementById('shareQrCanvas');
    const invitePreviewCanvas = document.getElementById('invitePreviewCanvas');
    const inviteTheme = document.getElementById('inviteTheme');
    const shareFeedback = document.getElementById('shareFeedback');

    function setShareFeedback(message) {
        if (shareFeedback) shareFeedback.textContent = message;
    }

    function getFullShareMessage() {
        const message = shareMessageInput?.value.trim() || defaultShareMessage;
        return `${message}\n${shortCelebrationUrl}`;
    }

    function drawWrappedText(context, text, x, y, maxWidth, lineHeight) {
        const words = text.split(/\s+/);
        const lines = [];
        let line = '';
        words.forEach(word => {
            const testLine = line ? `${line} ${word}` : word;
            if (context.measureText(testLine).width > maxWidth && line) {
                lines.push(line);
                line = word;
            } else {
                line = testLine;
            }
        });
        if (line) lines.push(line);
        lines.forEach((content, index) => context.fillText(content, x, y + index * lineHeight));
    }

    function fillRoundedRect(context, x, y, width, height, radius) {
        context.beginPath();
        context.moveTo(x + radius, y);
        context.lineTo(x + width - radius, y);
        context.quadraticCurveTo(x + width, y, x + width, y + radius);
        context.lineTo(x + width, y + height - radius);
        context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        context.lineTo(x + radius, y + height);
        context.quadraticCurveTo(x, y + height, x, y + height - radius);
        context.lineTo(x, y + radius);
        context.quadraticCurveTo(x, y, x + radius, y);
        context.closePath();
        context.fill();
    }

    function renderInvitePreview() {
        if (!invitePreviewCanvas || !shareQrCanvas) return;
        const context = invitePreviewCanvas.getContext('2d');
        const theme = inviteTheme?.value || 'playful';
        const themes = {
            playful: { background: '#FFF4E7', primary: '#E36A4B', accent: '#F7B43E', text: '#3A3A3A' },
            classic: { background: '#FFFDF9', primary: '#B86A55', accent: '#D9B879', text: '#34302D' },
            minimal: { background: '#FFFFFF', primary: '#3A3A3A', accent: '#E36A4B', text: '#3A3A3A' }
        };
        const palette = themes[theme];
        context.clearRect(0, 0, invitePreviewCanvas.width, invitePreviewCanvas.height);
        context.fillStyle = palette.background;
        context.fillRect(0, 0, invitePreviewCanvas.width, invitePreviewCanvas.height);

        if (theme === 'playful') {
            context.fillStyle = 'rgba(247, 180, 62, 0.25)';
            [[90, 95, 58], [810, 160, 42], [110, 1070, 36], [790, 1050, 64]].forEach(([x, y, radius]) => {
                context.beginPath();
                context.arc(x, y, radius, 0, Math.PI * 2);
                context.fill();
            });
        }

        context.textAlign = 'center';
        context.fillStyle = palette.primary;
        context.font = '700 28px Nunito, sans-serif';
        context.fillText("YOU'RE INVITED TO", 450, 150);
        context.fillStyle = palette.text;
        context.font = '700 72px Nunito, sans-serif';
        drawWrappedText(context, "Mauro's 5th Birthday", 450, 250, 720, 82);
        context.fillStyle = palette.accent;
        context.fillRect(380, 430, 140, 8);
        context.fillStyle = palette.text;
        context.font = '500 30px Rubik, sans-serif';
        context.fillText('September 23, 2026 · 4:00 PM', 450, 510);
        context.font = '400 25px Rubik, sans-serif';
        drawWrappedText(context, 'Kids Buffet · 22 Berkeley Square · London W1J 6EF', 450, 565, 680, 38);
        context.fillStyle = theme === 'minimal' ? '#F7F7F7' : '#FFFFFF';
        fillRoundedRect(context, 250, 680, 400, 390, 28);
        context.drawImage(shareQrCanvas, 330, 720, 240, 240);
        context.fillStyle = palette.text;
        context.font = '500 22px Rubik, sans-serif';
        context.fillText('Scan to view details and RSVP', 450, 1010);
        context.fillStyle = palette.primary;
        context.font = '700 22px Nunito, sans-serif';
        context.fillText('cado.com/mauro-5', 450, 1050);
        context.fillStyle = '#8A817A';
        context.font = '500 18px Rubik, sans-serif';
        context.fillText('Made with Cado', 450, 1145);
    }

    async function renderShareAssets() {
        if (!shareQrCanvas || !window.CadoQRCode?.toCanvas) {
            setShareFeedback('QR generator is unavailable. The share link can still be copied.');
            return;
        }
        await window.CadoQRCode.toCanvas(shareQrCanvas, shortCelebrationUrl, {
            width: 180,
            margin: 1,
            color: { dark: '#3A3A3A', light: '#FFFFFF' }
        });
        renderInvitePreview();
        setShareFeedback('QR code and printable invitation are ready.');
    }

    function downloadCanvas(canvas, filename) {
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    function openShareModal(preferredPanel = '') {
        shareModal.classList.add('active');
        renderShareAssets();
        if (preferredPanel === 'qr') {
            setTimeout(() => document.querySelector('.share-qr-panel')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
        } else {
            setTimeout(() => shareMessageInput?.focus(), 80);
        }
    }

    document.querySelectorAll('#shareBtn, #shareBtnMobile, [data-open-share]').forEach(button => {
        button.addEventListener('click', event => {
            event.preventDefault();
            openShareModal(button.dataset.openShare || '');
        });
    });

    document.querySelector('.close-share-modal')?.addEventListener('click', () => shareModal.classList.remove('active'));
    window.addEventListener('click', event => {
        if (event.target === shareModal) shareModal.classList.remove('active');
    });

    copyBtn?.addEventListener('click', async () => {
        await copyCadoText(shortCelebrationUrl);
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        setTimeout(() => { copyBtn.innerHTML = originalText; }, 2000);
    });

    shareGrid.addEventListener('click', async event => {
        const button = event.target.closest('[data-share-channel]');
        if (!button) return;
        const channel = button.dataset.shareChannel;
        const fullMessage = getFullShareMessage();
        if (channel === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(fullMessage)}`, '_blank', 'noopener');
        if (channel === 'email') window.location.href = `mailto:?subject=${encodeURIComponent("You're invited to Mauro's celebration")}&body=${encodeURIComponent(fullMessage)}`;
        if (channel === 'sms') {
            const separator = /iPhone|iPad|iPod/i.test(navigator.userAgent) ? '&' : '?';
            window.location.href = `sms:${separator}body=${encodeURIComponent(fullMessage)}`;
        }
        if (channel === 'copy') {
            await copyCadoText(fullMessage);
            setShareFeedback('Message and link copied.');
        }
    });

    inviteTheme?.addEventListener('change', renderInvitePreview);
    document.getElementById('downloadQrBtn')?.addEventListener('click', () => downloadCanvas(shareQrCanvas, 'cado-mauro-5-qr.png'));
    document.getElementById('downloadInviteBtn')?.addEventListener('click', () => downloadCanvas(invitePreviewCanvas, `cado-mauro-5-${inviteTheme?.value || 'playful'}.png`));
    document.getElementById('printInviteBtn')?.addEventListener('click', () => {
        if (!invitePreviewCanvas) return;
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            setShareFeedback('Allow pop-ups to print or save the invitation as PDF.');
            return;
        }
        printWindow.opener = null;
        const imageUrl = invitePreviewCanvas.toDataURL('image/png');
        printWindow.document.write(`<html><head><title>Cado invitation</title><style>html,body{margin:0;background:#fff}img{display:block;width:min(100%,210mm);margin:auto}@page{size:A4;margin:0}</style></head><body><img src="${imageUrl}" onload="window.print()"></body></html>`);
        printWindow.document.close();
    });
}

// INICIALIZAÇÃO GERAL (AGUARDA O HTML CARREGAR)
document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       2. LÓGICA DO ACORDEÃO FAQ (HOME)
       ========================================================================== */
    const faqQuestions = document.querySelectorAll('.faq-question');

    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                // Alterna a classe 'active' no botão clicado
                question.classList.toggle('active');

                // Pega o elemento da resposta (o próximo irmão)
                const answer = question.nextElementSibling;
                const icon = question.querySelector('i');

                // Lógica de altura máxima para animação suave
                if (question.classList.contains('active')) {
                    answer.style.maxHeight = answer.scrollHeight + "px";
                    icon.classList.remove('fa-plus');
                    icon.classList.add('fa-minus');
                } else {
                    answer.style.maxHeight = null;
                    icon.classList.remove('fa-minus');
                    icon.classList.add('fa-plus');
                }
            });
        });
    }

    /* ==========================================================================
       3. LÓGICA DO SLIDER DE DEPOIMENTOS (HOME)
       ========================================================================== */
    const textEl = document.getElementById('testiText');
    const nameEl = document.getElementById('testiName');
    const roleEl = document.getElementById('testiRole');
    const avatarEl = document.getElementById('testiAvatar');

    // VERIFICAÇÃO DE SEGURANÇA: Só roda se os elementos existirem na página
    if (textEl && nameEl && roleEl && avatarEl) {

        const testimonialsData = [
            {
                text: "Using Cado for our wedding was the best decision. Instead of receiving 5 toasters, we got contributions towards our honeymoon in Bali. It felt so much more personal and meaningful.",
                name: "Sarah & Mike",
                role: "Weddings & Partnership",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg"
            },
            {
                text: "For my son's 1st birthday, we wanted to avoid plastic clutter. Family contributed to his swimming lessons and a future college fund. It was incredibly easy for everyone to use.",
                name: "Juliana R.",
                role: "Children's Celebrations",
                avatar: "https://randomuser.me/api/portraits/women/68.jpg"
            },
            {
                text: "Organizing my baby shower was stress-free. The 'Create Celebration' tool is intuitive, and I loved reading the messages guests left with their contributions.",
                name: "Emily Thompson",
                role: "Baby Celebrations",
                avatar: "https://randomuser.me/api/portraits/women/12.jpg"
            },
            {
                text: "We used Cado for our housewarming. Friends chipped in for our dream sofa. It brought everyone together to help us build our new home.",
                name: "Carlos Mendez",
                role: "New Home Celebration",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg"
            }
        ];

        let currentTestimonialIndex = 0;

        function updateTestimonial() {
            const data = testimonialsData[currentTestimonialIndex];

            // Efeito simples de fade
            textEl.style.opacity = 0;

            setTimeout(() => {
                textEl.textContent = `"${data.text}"`;
                nameEl.textContent = data.name;
                roleEl.textContent = data.role;
                avatarEl.src = data.avatar;
                textEl.style.opacity = 1;
            }, 200);
        }

        // Expondo as funções de navegação para o escopo global
        window.nextTestimonial = function () {
            currentTestimonialIndex++;
            if (currentTestimonialIndex >= testimonialsData.length) {
                currentTestimonialIndex = 0;
            }
            updateTestimonial();
        };

        window.prevTestimonial = function () {
            currentTestimonialIndex--;
            if (currentTestimonialIndex < 0) {
                currentTestimonialIndex = testimonialsData.length - 1;
            }
            updateTestimonial();
        };

        // Inicializa
        updateTestimonial();
    }

    /* ==========================================================================
       4. GIFT MARKETPLACE — CREATE CELEBRATION
       ========================================================================== */

    const giftGridEl = document.getElementById('giftGrid');

    if (giftGridEl) {

        // --- CURATED GIFT LIBRARY: 7 categories x 5 ideas per celebration type ---
        const giftCategoryConfig = {
            baby: [
                { id: 'essentials', label: 'Baby essentials', icon: 'fa-solid fa-baby', items: ['Baby Clothes Bundle', 'Nappies & Wipes Fund', 'Baby Bath Set', 'Feeding Essentials', 'Baby Care Kit'] },
                { id: 'nursery', label: 'Nursery / home', icon: 'fa-solid fa-house', items: ['Cot / Crib Fund', 'Nursery Chair', 'Baby Monitor', 'Changing Table', 'Nursery Decoration'] },
                { id: 'travel', label: 'Travel & on-the-go', icon: 'fa-solid fa-car-side', items: ['Pram / Stroller Fund', 'Car Seat Fund', 'Baby Carrier', 'Travel Cot', 'Changing Bag'] },
                { id: 'memories', label: 'Memories', icon: 'fa-solid fa-camera-retro', items: ['Newborn Photoshoot', 'Baby Memory Book', 'Handprint / Footprint Kit', 'Personalised Blanket', 'First Year Keepsake Box'] },
                { id: 'learning', label: 'Learning & play', icon: 'fa-solid fa-shapes', items: ['Baby Books', 'Sensory Toys', 'Play Mat', 'Music Toy Set', 'Montessori Toy Set'] },
                { id: 'support', label: 'Parent support', icon: 'fa-solid fa-hand-holding-heart', items: ['Meal Delivery Fund', 'Postpartum Care Basket', 'Cleaning Help Fund', 'Babysitting Support', 'Mum & Baby Wellness Session'] },
                { id: 'future', label: 'Future & meaning', icon: 'fa-solid fa-seedling', items: ['Baby Savings Fund', 'First Family Trip', 'First Birthday Fund', 'Education Fund', 'Family Memory Experience'] },
            ],
            kids: [
                { id: 'experiences', label: 'Experiences', icon: 'fa-solid fa-ticket', items: ['Theme Park Adventure', 'Zoo Adventure', 'Cinema Day', 'Aquarium Visit', 'Soft Play / Trampoline Park'] },
                { id: 'learning', label: 'Learning', icon: 'fa-solid fa-graduation-cap', items: ['Music Lessons', 'Swimming Lessons', 'Dance Classes', 'Language Classes', 'Science / Coding Club'] },
                { id: 'toys', label: 'Toys & fun', icon: 'fa-solid fa-puzzle-piece', items: ['LEGO / Building Set', 'Dollhouse / Play Kitchen', 'Outdoor Play Set', 'Board Game Collection', 'Giant Stuffed Toy'] },
                { id: 'sports', label: 'Sports & movement', icon: 'fa-solid fa-person-running', items: ['Bicycle Fund', 'Football Classes', 'Gymnastics Classes', 'Scooter / Helmet Set', 'Tennis Lessons'] },
                { id: 'books', label: 'Books & creativity', icon: 'fa-solid fa-palette', items: ['Book Subscription', 'Art Supplies Set', 'Craft Box Subscription', 'Personalised Story Book', 'Painting / Pottery Class'] },
                { id: 'tech', label: 'Tech & entertainment', icon: 'fa-solid fa-gamepad', items: ['Kids Headphones', 'Kids Camera', 'Learning Apps Fund', 'Gaming Console Fund', 'Karaoke / Music Speaker'] },
                { id: 'meaning', label: 'Meaningful gifts', icon: 'fa-solid fa-star', items: ['Future Savings', 'Bedroom Makeover', 'Big Birthday Experience', 'First Pet Fund', 'Special Family Trip'] },
            ],
            wedding: [
                { id: 'home', label: 'Home & life together', icon: 'fa-solid fa-house', items: ['Sofa Fund', 'Dining Table Fund', 'Bed / Mattress Fund', 'Cookware Set', 'Home Decoration Fund'] },
                { id: 'honeymoon', label: 'Honeymoon & travel', icon: 'fa-solid fa-plane-departure', items: ['Honeymoon Fund', 'Romantic Dinner', 'Hotel Stay', 'Flight Contribution', 'Special Experience Abroad'] },
                { id: 'experiences', label: 'Experiences together', icon: 'fa-solid fa-champagne-glasses', items: ['Couples Spa Day', 'Wine Tasting', 'Cooking Class', 'Theatre Night', 'Weekend Getaway'] },
                { id: 'kitchen', label: 'Kitchen & hosting', icon: 'fa-solid fa-utensils', items: ['Mixer / Kitchen Appliance', 'Coffee Machine', 'Dinnerware Set', 'Wine Glass Set', 'Hosting Essentials'] },
                { id: 'memories', label: 'Memories', icon: 'fa-solid fa-camera', items: ['Wedding Album', 'Couple Photoshoot', 'Framed Wedding Print', 'Personalised Home Sign', 'Memory Box'] },
                { id: 'future', label: 'Future plans', icon: 'fa-solid fa-compass', items: ['New Home Fund', 'Renovation Fund', 'Garden Makeover', 'Pet Fund', 'Future Family Fund'] },
                { id: 'meaning', label: 'Meaningful contributions', icon: 'fa-solid fa-heart', items: ['Charity Donation', 'Tree Planting Gift', 'Experience Jar', 'Date Night Fund', 'Dream Together Fund'] },
            ],
        };

        const giftCatalog = Object.fromEntries(
            Object.entries(giftCategoryConfig).map(([eventType, categories]) => [
                eventType,
                categories.flatMap((category, categoryIndex) => category.items.map((name, itemIndex) => ({
                    id: `${eventType}-${categoryIndex + 1}-${itemIndex + 1}`,
                    cat: category.id,
                    icon: category.icon,
                    name,
                }))),
            ])
        );

        // --- STATE ---
        let currentEventType = 'kids';
        let currentCategory  = 'all';
        let selectedGiftIds  = [];
        let searchQuery      = '';
        const MAX_GIFTS = 6;
        const GIFTS_VISIBLE = 9;
        let showAllGifts = false;

        // --- DOM REFS ---
        const giftCountNum   = document.getElementById('giftCountNum');
        const giftCounter    = document.getElementById('giftCounter');
        const giftLimitNotice = document.getElementById('giftLimitNotice');
        const giftSelectedBar = document.getElementById('giftSelectedBar');
        const giftSelectedTags = document.getElementById('giftSelectedTags');
        const giftSearchInput = document.getElementById('giftSearch');
        const giftCategoryBar = document.getElementById('giftCategoryBar');

        function renderCategoryChips() {
            if (!giftCategoryBar) return;
            const categories = giftCategoryConfig[currentEventType] || [];
            const options = [
                { id: 'all', label: 'All', icon: 'fa-solid fa-border-all' },
                ...categories,
            ];
            giftCategoryBar.innerHTML = '';
            options.forEach(category => {
                const chip = document.createElement('button');
                chip.type = 'button';
                chip.className = `gm-chip ${category.id === currentCategory ? 'active' : ''}`;
                chip.dataset.cat = category.id;
                chip.setAttribute('aria-pressed', String(category.id === currentCategory));
                chip.innerHTML = `<i class="${category.icon}"></i><span>${category.label}</span>`;
                chip.addEventListener('click', () => {
                    giftCategoryBar.querySelectorAll('.gm-chip').forEach(item => {
                        item.classList.remove('active');
                        item.setAttribute('aria-pressed', 'false');
                    });
                    chip.classList.add('active');
                    chip.setAttribute('aria-pressed', 'true');
                    currentCategory = category.id;
                    showAllGifts = false;
                    renderGiftGrid();
                });
                giftCategoryBar.appendChild(chip);
            });
        }

        function renderCustomGiftCategoryOptions() {
            const categories = giftCategoryConfig[currentEventType] || [];
            document.querySelectorAll('.custom-gift-category-select').forEach(select => {
                select.innerHTML = categories.map(category =>
                    `<option value="${category.id}">${category.label}</option>`
                ).join('');
            });
        }

        // --- RENDER GIFTS ---
        function renderGiftGrid() {
            const catalog = giftCatalog[currentEventType] || [];
            const filtered = catalog.filter(g => {
                const catMatch = currentCategory === 'all' || g.cat === currentCategory;
                const searchMatch = g.name.toLowerCase().includes(searchQuery.toLowerCase());
                return catMatch && searchMatch;
            });

            giftGridEl.innerHTML = '';

            if (filtered.length === 0) {
                giftGridEl.innerHTML = `
                    <div class="gm-empty">
                        <i class="fa-solid fa-gift"></i>
                        No gifts found. Try a different search or category!
                    </div>`;
                return;
            }

            const isMax = selectedGiftIds.length >= MAX_GIFTS;
            const visible = showAllGifts ? filtered : filtered.slice(0, GIFTS_VISIBLE);

            visible.forEach(gift => {
                const isSelected = selectedGiftIds.includes(gift.id);
                const isDisabled = isMax && !isSelected;
                const card = document.createElement('button');
                card.type = 'button';
                card.className = `gm-gift-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`;
                card.dataset.id = gift.id;
                card.disabled = isDisabled;
                card.setAttribute('aria-pressed', String(isSelected));
                card.innerHTML = `
                    <div class="gm-check"><i class="fa-solid fa-check"></i></div>
                    <div class="gm-emoji"><i class="${gift.icon || 'fa-solid fa-gift'}"></i></div>
                    <div class="gm-gift-name">${gift.name}</div>
                `;
                card.addEventListener('click', () => toggleGift(gift));
                giftGridEl.appendChild(card);
            });

            // "See more" button
            if (!showAllGifts && filtered.length > GIFTS_VISIBLE) {
                const wrap = document.createElement('div');
                wrap.className = 'gm-see-more-wrap';
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'btn-see-more';
                btn.innerHTML = `See more <i class="fa-solid fa-chevron-down"></i>`;
                btn.addEventListener('click', () => {
                    showAllGifts = true;
                    renderGiftGrid();
                });
                wrap.appendChild(btn);
                giftGridEl.appendChild(wrap);
            }
        }

        // --- TOGGLE GIFT ---
        function toggleGift(gift) {
            const idx = selectedGiftIds.indexOf(gift.id);
            if (idx > -1) {
                selectedGiftIds.splice(idx, 1);
            } else {
                if (selectedGiftIds.length >= MAX_GIFTS) return;
                selectedGiftIds.push(gift.id);
            }
            updateCounter();
            renderGiftGrid();
            renderSelectedTags();
        }

        // --- UPDATE COUNTER ---
        function updateCounter() {
            const count = selectedGiftIds.length;
            giftCountNum.textContent = count;

            // Animate badge
            giftCounter.classList.remove('bump');
            void giftCounter.offsetWidth; // reflow
            giftCounter.classList.add('bump');
            setTimeout(() => giftCounter.classList.remove('bump'), 350);

            // Full state
            if (count >= MAX_GIFTS) {
                giftCounter.classList.add('full');
                giftLimitNotice.classList.add('visible');
            } else {
                giftCounter.classList.remove('full');
                giftLimitNotice.classList.remove('visible');
            }
        }

        // --- RENDER SELECTED TAGS ---
        function renderSelectedTags() {
            if (selectedGiftIds.length === 0) {
                giftSelectedBar.style.display = 'none';
                return;
            }
            giftSelectedBar.style.display = 'flex';
            giftSelectedTags.innerHTML = '';

            const allGifts = Object.values(giftCatalog).flat();
            selectedGiftIds.forEach(id => {
                const gift = allGifts.find(g => g.id === id);
                if (!gift) return;
                const tag = document.createElement('span');
                tag.className = 'gm-tag';
                tag.innerHTML = `<i class="${gift.icon || 'fa-solid fa-gift'}"></i> ${gift.name} <span class="gm-tag-remove" data-id="${gift.id}">✕</span>`;
                tag.querySelector('.gm-tag-remove').addEventListener('click', () => {
                    selectedGiftIds = selectedGiftIds.filter(i => i !== id);
                    updateCounter();
                    renderGiftGrid();
                    renderSelectedTags();
                });
                giftSelectedTags.appendChild(tag);
            });
        }

        // --- SEARCH ---
        if (giftSearchInput) {
            giftSearchInput.addEventListener('input', () => {
                searchQuery = giftSearchInput.value;
                showAllGifts = false;
                renderGiftGrid();
            });
        }

        // --- EVENT TYPE CHANGE (from radio buttons) ---
        const eventTypeRadios = document.querySelectorAll('input[name="event_type"]');
        const eventNameInput  = document.getElementById('event-name-input');
        const fieldsSingle    = document.getElementById('fields-single');
        const fieldsCouple    = document.getElementById('fields-couple');
        const childAgeField   = document.getElementById('childAgeField');

        eventTypeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                currentEventType = e.target.value;
                currentCategory = 'all';
                selectedGiftIds = [];
                showAllGifts = false;
                updateCounter();
                renderCategoryChips();
                renderCustomGiftCategoryOptions();
                renderGiftGrid();
                renderSelectedTags();

                if (currentEventType === 'wedding') {
                    if (fieldsSingle) fieldsSingle.style.display = 'none';
                    if (fieldsCouple) fieldsCouple.style.display = 'grid';
                    if (childAgeField) childAgeField.style.display = 'none';
                    if (eventNameInput) eventNameInput.placeholder = "E.g., Sarah & Mike's Wedding";
                } else {
                    if (fieldsSingle) fieldsSingle.style.display = 'grid';
                    if (fieldsCouple) fieldsCouple.style.display = 'none';
                    if (childAgeField) childAgeField.style.display = currentEventType === 'kids' ? '' : 'none';
                    if (eventNameInput) {
                        eventNameInput.placeholder = currentEventType === 'baby'
                            ? "E.g., Julie's Baby Shower"
                            : "E.g., Mauro's 5th Birthday";
                    }
                }
            });
        });

        // --- ADD CUSTOM GIFT (exposed for Create Gift modal) ---
        window._addCustomGift = function(gift) {
            // Add to current event type catalog
            if (!giftCatalog[currentEventType]) giftCatalog[currentEventType] = [];
            giftCatalog[currentEventType].unshift(gift);
            // Auto-select it if slots available
            if (selectedGiftIds.length < MAX_GIFTS) {
                selectedGiftIds.push(gift.id);
            }
            showAllGifts = false;
            updateCounter();
            renderGiftGrid();
            renderSelectedTags();
        };

        // --- INIT ---
        renderCategoryChips();
        renderCustomGiftCategoryOptions();
        renderGiftGrid();
    }

    /* ==========================================================================
       5. MODAL RSVP (KIDS PARTY PAGE)
       ========================================================================== */

    const modal = document.getElementById('rsvpModal');

    // Só executa se o modal existir na página
    if (modal) {
        const openBtn = document.querySelector('.btn-confirm-presence');
        const closeBtn = document.querySelector('.close-modal-btn');
        const addGuestBtn = document.getElementById('btnAddGuest');
        const guestList = document.getElementById('guestList');

        // Inputs
        const inputName = document.getElementById('guestName');
        const inputAge = document.getElementById('guestAge');

        // 1. Abrir Modal
        if (openBtn) {
            openBtn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('active');
            });
        }

        // 2. Fechar Modal
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        // Fechar clicando fora da caixa branca
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        // 3. Adicionar Convidado à Lista
        if (addGuestBtn) {
            addGuestBtn.addEventListener('click', () => {
                const name = inputName.value;
                const age = inputAge.value;

                if (name === "") {
                    alert("Please enter a name.");
                    return;
                }

                // Remove mensagem de "lista vazia" se existir
                const emptyMsg = guestList.querySelector('.empty-msg');
                if (emptyMsg) emptyMsg.remove();

                // Cria o elemento da lista (LI)
                const li = document.createElement('li');
                li.className = 'guest-item';

                li.innerHTML = `
                    <div class="guest-info">
                        <strong>${name}</strong> ${age ? `(${age} y/o)` : ''}
                    </div>
                    <button type="button" class="btn-remove-guest">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                `;

                // Lógica para remover o item ao clicar na lixeira
                li.querySelector('.btn-remove-guest').addEventListener('click', () => {
                    li.remove();
                    // Se não sobrar ninguém, volta a msg de vazio
                    if (guestList.children.length === 0) {
                        guestList.innerHTML = '<li class="empty-msg">No guests added yet.</li>';
                    }
                });

                guestList.appendChild(li);

                // Limpa os inputs para a próxima pessoa
                inputName.value = '';
                inputAge.value = '';
                inputName.focus();
            });
        }
    }

    /* ==========================================================================
       6. MODAL DE CONTRIBUIÇÃO DE PRESENTES (GIFT MODAL)
       ========================================================================== */

    const giftModal = document.getElementById('giftModal');

    if (giftModal) {
        const giftButtons = document.querySelectorAll('.btn-contribute');
        const closeGiftBtn = document.querySelector('.close-gift-modal');
        const confirmGiftBtn = document.querySelector('.btn-confirm-gift');

        // Elementos internos do Modal para atualizar dinamicamente
        const modalTitle = document.getElementById('modalGiftTitle');
        const modalImg = document.getElementById('modalGiftImg');
        const priceInput = document.querySelector('.price-input'); // Input do valor

        // 1. Abrir Modal ao clicar em "Contribute"
        giftButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();

                // --- LÓGICA DINÂMICA ---
                // Encontra o card pai do botão clicado
                const card = btn.closest('.gift-card-item');

                if (card) {
                    // Pega os dados do card
                    const title = card.querySelector('h3').innerHTML; // Usa innerHTML para manter <br> se houver
                    const imgSrc = card.querySelector('img').src;

                    // Atualiza o Modal
                    modalTitle.innerHTML = title; // Define o título do modal
                    modalImg.src = imgSrc;        // Define a imagem do modal
                }

                giftModal.classList.add('active');
            });
        });

        // 2. Fechar Modal
        if (closeGiftBtn) {
            closeGiftBtn.addEventListener('click', () => {
                giftModal.classList.remove('active');
            });
        }

        // Fechar clicando fora
        window.addEventListener('click', (e) => {
            if (e.target === giftModal) {
                giftModal.classList.remove('active');
            }
        });

        /* ==========================================================================
           7. INTEGRAÇÃO GIFT MODAL -> PAYMENT MODAL
           ========================================================================== */

        const paymentModal = document.getElementById('paymentModal');
        const closePayBtn = document.querySelector('.close-payment-modal');

        // Elementos do Checkout para atualizar
        const payGiftName = document.getElementById('payGiftName');
        const payTotalAmount = document.getElementById('payTotalAmount');
        const amountDisplays = document.querySelectorAll('.btnPayAmountDisplay'); // Spans de valor

        // Abas de Pagamento
        const payTabs = document.querySelectorAll('.pay-tab');

        // Formulários de Pagamento
        const allForms = {
            'card': document.getElementById('cardForm'),
            'google': document.getElementById('googleForm'),
            'apple': document.getElementById('appleForm')
        };

        // 3. Ação do Botão "Confirm Contribution" (Abre Checkout)
        if (confirmGiftBtn && paymentModal) {
            confirmGiftBtn.addEventListener('click', () => {

                // Validação simples
                const amount = priceInput.value;
                if (!amount || amount <= 0) {
                    alert("Please enter a valid amount to contribute.");
                    return;
                }

                // A. Fecha o Modal de Presente
                giftModal.classList.remove('active');

                // B. Passa os dados para o Modal de Pagamento
                const currentGiftTitle = document.getElementById('modalGiftTitle').innerText;

                payGiftName.innerText = currentGiftTitle;
                payTotalAmount.innerText = `£${amount}`;

                // Atualiza o valor nos botões de pagamento (todos eles)
                amountDisplays.forEach(display => {
                    display.innerText = `£${amount}`;
                });

                // C. Abre o Modal de Pagamento
                paymentModal.classList.add('active');
            });
        }

        // Fechar Modal de Pagamento
        if (closePayBtn) {
            closePayBtn.addEventListener('click', () => {
                paymentModal.classList.remove('active');
            });
        }

        // Fechar clicando fora
        window.addEventListener('click', (e) => {
            if (e.target === paymentModal) {
                paymentModal.classList.remove('active');
            }
        });

        /* --- Lógica das Abas de Pagamento (Card, Google Pay, Apple Pay) --- */
        payTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // 1. Visual da Aba
                payTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // 2. Conteúdo: Esconde TODOS e mostra o selecionado
                Object.values(allForms).forEach(form => {
                    if (form) form.style.display = 'none';
                });

                const method = tab.getAttribute('data-method');
                if (allForms[method]) {
                    allForms[method].style.display = 'block';
                }
            });
        });

        /* ==========================================================================
           8. REDIRECIONAMENTO PARA THANK YOU PAGE
           ========================================================================== */

        // Função para simular processamento e redirecionar
        function processPaymentAndRedirect() {
            // Texto do botão muda para "Processing..."
            // Salva o texto original se quiser restaurar (opcional)
            this.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing...';
            this.style.pointerEvents = 'none'; // Evita clique duplo

            // Simula delay de 1.5 segundos (tempo de "processar" o pagamento)
            setTimeout(() => {
                window.location.href = 'thank-you.html';
            }, 1500);
        }

        // 1. Botão "Pay Now" (Cartão)
        const btnPayNow = document.querySelector('.btn-pay-now');
        if (btnPayNow) {
            btnPayNow.addEventListener('click', processPaymentAndRedirect);
        }

        // 2. Botão "Apple Pay"
        const btnApplePay = document.querySelector('.btn-apple-pay');
        if (btnApplePay) {
            btnApplePay.addEventListener('click', processPaymentAndRedirect);
        }

        const btnGooglePay = document.querySelector('.btn-google-pay');
        if (btnGooglePay) {
            btnGooglePay.addEventListener('click', processPaymentAndRedirect);
        }
    }

    /* ==========================================================================
       9. MODAL: SHARE CELEBRATION
       ========================================================================== */
    const shareModal = document.getElementById('shareModal');
    if (shareModal && !document.body.classList.contains('guest-landing-page')) {
        initializeHostShareModal(shareModal);
    }

    const openMapsLink = document.getElementById('openMapsLink');
    if (openMapsLink) {
        const address = openMapsLink.dataset.address || openMapsLink.textContent.trim();
        const isAppleDevice = /iPad|iPhone|iPod|Macintosh/i.test(navigator.userAgent);
        openMapsLink.href = isAppleDevice
            ? `https://maps.apple.com/?q=${encodeURIComponent(address)}`
            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    }

    document.querySelectorAll('.message-card[data-email]').forEach(card => {
        if (card.querySelector('.btn-thank-you')) return;
        const guestName = card.querySelector('.guest-msg-name')?.textContent.trim() || 'there';
        const email = card.dataset.email;
        const subject = "Thank you for being part of Mauro's celebration";
        const body = `Hi ${guestName},\n\nThank you for celebrating with us. Your message and support made the day even more meaningful.\n\nWith love,\nMauro's family`;
        const button = document.createElement('a');
        button.className = 'btn-thank-you';
        button.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        button.innerHTML = '<i class="fa-regular fa-paper-plane"></i> Send thank-you';
        card.appendChild(button);
    });

    /* ==========================================================================
       10. LIVE PREVIEW: CREATOR'S CANVAS
       ========================================================================== */
    const eventNameInput = document.getElementById('event-name-input');
    const eventDescInput = document.getElementById('event-desc-input');
    const bannerInput = document.getElementById('bannerInput');
    const bannerUploadLabel = document.getElementById('bannerUploadLabel');
    const previewName = document.getElementById('previewDisplayName');
    const previewDesc = document.getElementById('previewDisplayDesc');
    const previewPhoto = document.getElementById('previewPhoto');
    const previewAgeStat = document.getElementById('previewAgeStat');
    const previewTheme = document.getElementById('previewDisplayTheme');
    const eventDateInput = document.getElementById('event-date-input');
    const eventTimeInput = document.getElementById('event-time-input');
    const eventPostcodeInput = document.getElementById('event-postcode-input');
    const eventAddressInput = document.getElementById('event-address-input');
    const previewDateStat = document.getElementById('previewDateStat');
    const previewDisplayDate = document.getElementById('previewDisplayDate');
    const previewLocationStat = document.getElementById('previewLocationStat');
    const previewDisplayLocation = document.getElementById('previewDisplayLocation');
    const partnerOneInput = document.getElementById('partner-one-input');
    const partnerTwoInput = document.getElementById('partner-two-input');
    const coupleGoalInput = document.getElementById('couple-goal-input');
    const previewPlaceholders = {
        baby: { image: 'img/card-1.png', name: 'A beautiful new beginning', theme: 'Baby celebration' },
        kids: { image: 'img/card-2.png', name: "Mauro's Party", theme: 'Celebration theme' },
        wedding: { image: 'img/card-3.png', name: 'Together, always', theme: 'Our next adventure' },
    };
    const localAddressSuggestions = {
        'W1J 6EF': 'Kids Buffet, 22 Berkeley Square, London W1J 6EF',
        'SW7 2AP': 'Science Museum, Exhibition Road, London SW7 2AP',
        'SE1 2AA': 'Tower Bridge, Tower Bridge Road, London SE1 2AA',
        'M1 1AE': 'Northern Quarter, Manchester M1 1AE',
        'B1 1BB': 'Centenary Square, Birmingham B1 1BB'
    };

    function updateEventLogisticsPreview() {
        if (previewDisplayDate && previewDateStat) {
            const dateValue = eventDateInput?.value;
            const timeValue = eventTimeInput?.value;
            if (dateValue) {
                const [year, month, day] = dateValue.split('-').map(Number);
                const formattedDate = new Intl.DateTimeFormat('en-GB', {
                    day: 'numeric', month: 'short', year: 'numeric'
                }).format(new Date(year, month - 1, day));
                previewDisplayDate.textContent = timeValue ? `${formattedDate} at ${timeValue}` : formattedDate;
                previewDateStat.hidden = false;
            } else {
                previewDisplayDate.textContent = '';
                previewDateStat.hidden = true;
            }
        }

        if (previewDisplayLocation && previewLocationStat) {
            const location = eventAddressInput?.value.trim() || eventPostcodeInput?.value.trim();
            previewDisplayLocation.textContent = location;
            previewLocationStat.hidden = !location;
        }
    }

    eventDateInput?.addEventListener('input', updateEventLogisticsPreview);
    eventTimeInput?.addEventListener('input', updateEventLogisticsPreview);
    eventAddressInput?.addEventListener('input', () => {
        const matchingPostcode = Object.entries(localAddressSuggestions)
            .find(([, address]) => address === eventAddressInput.value)?.[0];
        if (matchingPostcode && eventPostcodeInput) eventPostcodeInput.value = matchingPostcode;
        updateEventLogisticsPreview();
    });
    eventPostcodeInput?.addEventListener('input', () => {
        const normalizedPostcode = eventPostcodeInput.value.trim().toUpperCase();
        const matchingAddress = localAddressSuggestions[normalizedPostcode];
        if (matchingAddress && eventAddressInput) eventAddressInput.value = matchingAddress;
        updateEventLogisticsPreview();
    });

    function getSelectedEventType() {
        return document.querySelector('input[name="event_type"]:checked')?.value || 'kids';
    }

    function updateCouplePreview() {
        if (getSelectedEventType() !== 'wedding' || !previewName) return;
        if (eventNameInput?.value.trim()) {
            previewName.textContent = eventNameInput.value.trim();
            return;
        }
        const firstName = partnerOneInput?.value.trim();
        const secondName = partnerTwoInput?.value.trim();
        previewName.textContent = firstName || secondName
            ? [firstName, secondName].filter(Boolean).join(' & ')
            : previewPlaceholders.wedding.name;
    }

    function updatePreviewForEventType(eventType) {
        const config = previewPlaceholders[eventType] || previewPlaceholders.kids;
        if (previewPhoto && previewPhoto.dataset.hasUpload !== 'true') {
            previewPhoto.style.backgroundImage = `url('${config.image}')`;
        }
        if (previewPhoto) {
            previewPhoto.classList.remove('preview-type-baby', 'preview-type-kids', 'preview-type-wedding');
            previewPhoto.classList.add(`preview-type-${eventType}`);
        }
        if (previewAgeStat) {
            const ageInput = document.querySelector('[data-target="preview-age"]');
            previewAgeStat.hidden = eventType !== 'kids' || !ageInput?.value;
        }
        if (previewName && !eventNameInput?.value) {
            previewName.textContent = config.name;
        }
        if (previewTheme) {
            previewTheme.textContent = eventType === 'wedding'
                ? (coupleGoalInput?.value || config.theme)
                : (document.querySelector('[data-target="preview-theme"]')?.value || config.theme);
        }
        if (eventType === 'wedding') updateCouplePreview();
    }

    // Sync Text Inputs
    if (eventNameInput && previewName) {
        eventNameInput.addEventListener('input', () => {
            if (getSelectedEventType() === 'wedding' && !eventNameInput.value) {
                updateCouplePreview();
            } else {
                previewName.textContent = eventNameInput.value || previewPlaceholders[getSelectedEventType()].name;
            }
        });
    }

    if (eventDescInput && previewDesc) {
        eventDescInput.addEventListener('input', () => {
            previewDesc.textContent = eventDescInput.value || "Tell your guests about the party details...";
        });
    }

    // Sync Additional Info
    document.querySelectorAll('.preview-sync').forEach(input => {
        input.addEventListener('input', () => {
            const targetId = input.getAttribute('data-target'); // e.g. preview-age
            // Convert 'preview-age' to 'previewDisplayAge'
            const part = targetId.split('-')[1];
            const capitalized = part.charAt(0).toUpperCase() + part.slice(1);
            const displayEl = document.getElementById('previewDisplay' + capitalized);

            if (displayEl) {
                if (targetId === 'preview-age') {
                    displayEl.textContent = input.value;
                    if (previewAgeStat) previewAgeStat.hidden = getSelectedEventType() !== 'kids' || !input.value;
                } else {
                    displayEl.textContent = input.value || previewPlaceholders[getSelectedEventType()].theme;
                }
            }
        });
    });

    [partnerOneInput, partnerTwoInput].forEach(input => input?.addEventListener('input', updateCouplePreview));
    coupleGoalInput?.addEventListener('input', () => {
        if (previewTheme && getSelectedEventType() === 'wedding') {
            previewTheme.textContent = coupleGoalInput.value || previewPlaceholders.wedding.theme;
        }
    });

    // Image Upload Preview Trigger
    const uploadBox = document.getElementById('bannerUploadBox');
    if (uploadBox && bannerInput) {
        uploadBox.addEventListener('click', () => {
            bannerInput.value = '';
            bannerInput.click();
        });
    }

    if (bannerInput && previewPhoto) {
        let activePreviewObjectUrl = '';

        bannerInput.addEventListener('change', function () {
            const file = this.files[0];
            if (!file) return;

            if (file.type && !file.type.startsWith('image/')) {
                this.value = '';
                if (bannerUploadLabel) bannerUploadLabel.textContent = 'Choose an image file';
                return;
            }

            const maxUploadBytes = 15 * 1024 * 1024;
            if (file.size > maxUploadBytes) {
                this.value = '';
                if (bannerUploadLabel) bannerUploadLabel.textContent = 'Maximum file size is 15 MB';
                return;
            }

            if (bannerUploadLabel) bannerUploadLabel.textContent = 'Optimising image...';
            const sourceUrl = URL.createObjectURL(file);
            const image = new Image();

            image.onload = () => {
                const maxDimension = 1920;
                const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
                const canvas = document.createElement('canvas');
                canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
                canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
                const context = canvas.getContext('2d');
                context.drawImage(image, 0, 0, canvas.width, canvas.height);

                canvas.toBlob(compressedBlob => {
                    URL.revokeObjectURL(sourceUrl);
                    const previewBlob = compressedBlob || file;
                    if (activePreviewObjectUrl) URL.revokeObjectURL(activePreviewObjectUrl);
                    activePreviewObjectUrl = URL.createObjectURL(previewBlob);
                    previewPhoto.style.backgroundImage = `url("${activePreviewObjectUrl}")`;
                    previewPhoto.dataset.hasUpload = 'true';
                    if (bannerUploadLabel) {
                        const originalMegabytes = file.size / (1024 * 1024);
                        const finalMegabytes = previewBlob.size / (1024 * 1024);
                        bannerUploadLabel.textContent = `${file.name.length > 16 ? `${file.name.slice(0, 13)}...` : file.name} (${originalMegabytes.toFixed(1)} → ${finalMegabytes.toFixed(1)} MB)`;
                    }
                }, 'image/webp', 0.82);
            };
            image.onerror = () => {
                URL.revokeObjectURL(sourceUrl);
                this.value = '';
                if (bannerUploadLabel) bannerUploadLabel.textContent = 'Try another image';
            };
            image.src = sourceUrl;
        });
    }

    document.querySelectorAll('.image-position-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.image-position-btn').forEach(item => item.classList.remove('active'));
            button.classList.add('active');
            if (previewPhoto) previewPhoto.style.backgroundPosition = button.dataset.position;
        });
    });

    // Handle Category/Type Selection
    document.querySelectorAll('input[name="event_type"]').forEach(radio => {
        radio.addEventListener('change', () => {
            updatePreviewForEventType(radio.value);
        });
    });

    if (previewPhoto) updatePreviewForEventType(getSelectedEventType());

    const creationSteps = [...document.querySelectorAll('.creation-step')];
    function setActiveCreationStep(stepLink) {
        creationSteps.forEach(link => {
            const isActive = link === stepLink;
            link.classList.toggle('active', isActive);
            if (isActive) link.setAttribute('aria-current', 'step');
            else link.removeAttribute('aria-current');
        });
    }
    creationSteps.forEach(stepLink => {
        stepLink.addEventListener('click', () => setActiveCreationStep(stepLink));
        const target = document.querySelector(stepLink.getAttribute('href'));
        target?.addEventListener('focusin', () => setActiveCreationStep(stepLink));
    });
    if ('IntersectionObserver' in window) {
        const formStepObserver = new IntersectionObserver(entries => {
            const visibleEntry = entries
                .filter(entry => entry.isIntersecting)
                .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];
            if (!visibleEntry) return;
            const matchingStep = creationSteps.find(link => link.getAttribute('href') === `#${visibleEntry.target.id}`);
            if (matchingStep) setActiveCreationStep(matchingStep);
        }, { rootMargin: '-18% 0px -62% 0px', threshold: [0.05, 0.25, 0.5] });
        document.querySelectorAll('.form-step-card[id]').forEach(section => formStepObserver.observe(section));
    }
    if (creationSteps[0]) setActiveCreationStep(creationSteps[0]);

    const hostSetupModal = document.getElementById('hostSetupModal');
    const hostSetupForm = document.getElementById('hostSetupForm');
    const hostSetupSaved = document.getElementById('hostSetupSaved');
    const openHostSetupButton = document.querySelector('.creation-form .btn-create-page');
    const closeHostSetupButton = document.querySelector('.close-host-setup-modal');

    if (hostSetupModal && hostSetupForm && openHostSetupButton) {
        openHostSetupButton.addEventListener('click', () => {
            hostSetupModal.classList.add('active');
            setTimeout(() => document.getElementById('host-name-input')?.focus(), 80);
        });
        closeHostSetupButton?.addEventListener('click', () => hostSetupModal.classList.remove('active'));
        window.addEventListener('click', event => {
            if (event.target === hostSetupModal) hostSetupModal.classList.remove('active');
        });

        hostSetupForm.addEventListener('submit', event => {
            event.preventDefault();
            if (!hostSetupForm.reportValidity()) return;
            const draft = {
                hostName: document.getElementById('host-name-input')?.value.trim() || '',
                hostEmail: document.getElementById('host-email-input')?.value.trim() || '',
                eventType: getSelectedEventType(),
                eventName: eventNameInput?.value.trim() || '',
                description: eventDescInput?.value.trim() || '',
                date: eventDateInput?.value || '',
                time: eventTimeInput?.value || '',
                postcode: eventPostcodeInput?.value.trim() || '',
                address: eventAddressInput?.value.trim() || '',
                savedAt: new Date().toISOString()
            };
            try {
                localStorage.setItem('cadoCelebrationDraft', JSON.stringify(draft));
            } catch (error) {
                console.warn('The celebration draft could not be saved locally.', error);
            }
            hostSetupForm.hidden = true;
            if (hostSetupSaved) hostSetupSaved.hidden = false;
        });
    }

    /* ==========================================================================
       11. CREATE GIFT MODAL
       ========================================================================== */
    const createGiftModal = document.getElementById('createGiftModal');
    const openCreateGiftBtn = document.getElementById('openCreateGiftModal');
    const closeCreateGiftBtn = document.querySelector('.close-create-gift-modal');

    if (createGiftModal && openCreateGiftBtn) {
        // Open
        openCreateGiftBtn.addEventListener('click', () => {
            createGiftModal.classList.add('active');
        });

        // Close
        if (closeCreateGiftBtn) {
            closeCreateGiftBtn.addEventListener('click', () => {
                createGiftModal.classList.remove('active');
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target === createGiftModal) createGiftModal.classList.remove('active');
        });

        // Simple / Complex toggle
        const giftTypeBtns = createGiftModal.querySelectorAll('.gift-type-btn');
        const simpleForm = document.getElementById('simpleGiftForm');
        const complexForm = document.getElementById('complexGiftForm');

        giftTypeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                giftTypeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const type = btn.dataset.type;
                if (type === 'simple') {
                    simpleForm.style.display = 'flex';
                    complexForm.style.display = 'none';
                } else {
                    simpleForm.style.display = 'none';
                    complexForm.style.display = 'flex';
                }
            });
        });

        // Helper: add custom gift to catalog & select it
        function addCustomGiftToCatalog(name, category) {
            if (!name.trim()) { alert('Please enter a gift name.'); return false; }
            const customId = 'custom_' + Date.now();
            const icon = 'fa-solid fa-gift';
            const newGift = { id: customId, cat: category, icon, name: name.trim() };
            // Add to all event type catalogs so it shows regardless of type
            const giftGridEl = document.getElementById('giftGrid');
            if (giftGridEl) {
                // Find the JS giftCatalog via the rendered giftGrid context —
                // inject directly via a global helper set up in the gift section
                if (window._addCustomGift) window._addCustomGift(newGift);
            }
            return true;
        }

        // Simple add
        const addSimpleBtn = document.getElementById('addSimpleGift');
        if (addSimpleBtn) {
            addSimpleBtn.addEventListener('click', () => {
                const name = document.getElementById('customGiftName').value;
                const cat = document.getElementById('customGiftCategory').value;
                if (window._addCustomGift && name.trim()) {
                    window._addCustomGift({ id: 'custom_' + Date.now(), cat, icon: 'fa-solid fa-gift', name: name.trim() });
                    document.getElementById('customGiftName').value = '';
                    createGiftModal.classList.remove('active');
                } else {
                    alert('Please enter a gift name.');
                }
            });
        }

        // Complex add
        const addComplexBtn = document.getElementById('addComplexGift');
        if (addComplexBtn) {
            addComplexBtn.addEventListener('click', () => {
                const name = document.getElementById('customGiftNameComplex').value;
                const cat = document.getElementById('customGiftCategoryComplex').value;
                if (window._addCustomGift && name.trim()) {
                    window._addCustomGift({ id: 'custom_' + Date.now(), cat, icon: 'fa-solid fa-gift', name: name.trim() });
                    document.getElementById('customGiftNameComplex').value = '';
                    document.getElementById('customGiftDesc').value = '';
                    createGiftModal.classList.remove('active');
                } else {
                    alert('Please enter a gift name.');
                }
            });
        }
    }

    // Animate reveals on scroll (simple implementation)
    const observerOptions = {
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-reveal').forEach(el => {
        // Since we use forwards in CSS, we don't strictly need JS for the first reveal, 
        // but we can add staggered delays here.
    });

});
