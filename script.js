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

        // --- GIFT DATABASE ---
        const giftCatalog = {
            baby: [
                { id: 'b1',  cat: 'experiences', emoji: '📸', name: 'Newborn Photoshoot',   price: 'from $80' },
                { id: 'b2',  cat: 'experiences', emoji: '🛁', name: 'Baby Spa Day',         price: 'from $50' },
                { id: 'b3',  cat: 'experiences', emoji: '🏊', name: 'First Swim Class',     price: 'from $40' },
                { id: 'b4',  cat: 'experiences', emoji: '💆', name: 'Mommy Massage',        price: 'from $60' },
                { id: 'b5',  cat: 'experiences', emoji: '🎠', name: 'Baby Fair Day',        price: 'from $30' },
                { id: 'b6',  cat: 'learning',    emoji: '📖', name: 'Baby Sign Language',   price: 'from $45' },
                { id: 'b7',  cat: 'learning',    emoji: '🎵', name: 'Music & Rhythm Class', price: 'from $35' },
                { id: 'b8',  cat: 'learning',    emoji: '👶', name: 'Parenting Workshop',   price: 'from $50' },
                { id: 'b9',  cat: 'learning',    emoji: '😴', name: 'Sleep Consultant',     price: 'from $80' },
                { id: 'b10', cat: 'toys',        emoji: '🧸', name: 'Organic Stuffed Toy',  price: 'from $25' },
                { id: 'b11', cat: 'toys',        emoji: '🎧', name: 'Sound Machine',        price: 'from $35' },
                { id: 'b12', cat: 'toys',        emoji: '🛏️', name: 'Baby Crib Mobile',     price: 'from $30' },
                { id: 'b13', cat: 'books',       emoji: '📚', name: 'Baby Book Bundle',     price: 'from $20' },
                { id: 'b14', cat: 'books',       emoji: '🎨', name: 'Baby Art Journal',     price: 'from $15' },
                { id: 'b15', cat: 'meaning',     emoji: '🏦', name: 'College Fund',         price: 'any amount' },
                { id: 'b16', cat: 'meaning',     emoji: '🌳', name: 'Plant a Tree',         price: 'from $10' },
                { id: 'b17', cat: 'meaning',     emoji: '💛', name: 'First Savings Account',price: 'any amount' },
                { id: 'b18', cat: 'meaning',     emoji: '🥄', name: 'Silver Keepsake',      price: 'from $40' },
            ],
            kids: [
                { id: 'k1',  cat: 'experiences', emoji: '🎡', name: 'Theme Park Ticket',    price: 'from $50' },
                { id: 'k2',  cat: 'experiences', emoji: '🎬', name: 'Cinema Day',           price: 'from $20' },
                { id: 'k3',  cat: 'experiences', emoji: '🦁', name: 'Zoo Adventure',        price: 'from $25' },
                { id: 'k4',  cat: 'experiences', emoji: '🎳', name: 'Bowling Party',        price: 'from $30' },
                { id: 'k5',  cat: 'experiences', emoji: '🏖️', name: 'Beach Day Trip',       price: 'from $40' },
                { id: 'k6',  cat: 'experiences', emoji: '🧗', name: 'Rock Climbing',        price: 'from $35' },
                { id: 'k7',  cat: 'learning',    emoji: '🎨', name: 'Art Workshop',         price: 'from $30' },
                { id: 'k8',  cat: 'learning',    emoji: '🎹', name: 'Piano Lessons',        price: 'from $40' },
                { id: 'k9',  cat: 'learning',    emoji: '💻', name: 'Coding Camp',          price: 'from $60' },
                { id: 'k10', cat: 'learning',    emoji: '⚽', name: 'Soccer Coaching',      price: 'from $35' },
                { id: 'k11', cat: 'learning',    emoji: '🥋', name: 'Karate Classes',       price: 'from $40' },
                { id: 'k12', cat: 'toys',        emoji: '🧸', name: 'Giant Stuffed Bear',   price: 'from $30' },
                { id: 'k13', cat: 'toys',        emoji: '🚲', name: 'Bicycle Fund',         price: 'from $80' },
                { id: 'k14', cat: 'toys',        emoji: '🪀', name: 'Outdoor Play Set',     price: 'from $50' },
                { id: 'k15', cat: 'toys',        emoji: '🎲', name: 'Board Game Collection',price: 'from $25' },
                { id: 'k16', cat: 'tech',        emoji: '🎮', name: 'Gaming Console',       price: 'from $100'},
                { id: 'k17', cat: 'tech',        emoji: '🎧', name: 'Kids Headphones',      price: 'from $30' },
                { id: 'k18', cat: 'tech',        emoji: '📷', name: 'Kids Camera',          price: 'from $45' },
                { id: 'k19', cat: 'books',       emoji: '📚', name: 'Book Subscription',    price: 'from $15/mo'},
                { id: 'k20', cat: 'books',       emoji: '🗺️', name: 'World Atlas Set',      price: 'from $20' },
                { id: 'k21', cat: 'sports',      emoji: '🏊', name: 'Swimming Lessons',     price: 'from $50' },
                { id: 'k22', cat: 'sports',      emoji: '🤸', name: 'Gymnastics Class',     price: 'from $45' },
                { id: 'k23', cat: 'sports',      emoji: '🎾', name: 'Tennis Lessons',       price: 'from $40' },
                { id: 'k24', cat: 'meaning',     emoji: '🌟', name: 'Future Savings',       price: 'any amount'},
                { id: 'k25', cat: 'meaning',     emoji: '🌳', name: 'Adopt a Tree',         price: 'from $10' },
                { id: 'k26', cat: 'meaning',     emoji: '🐾', name: 'Sponsor an Animal',    price: 'from $15' },
            ],
            wedding: [
                { id: 'w1',  cat: 'experiences', emoji: '🍽️', name: 'Romantic Dinner',      price: 'from $60' },
                { id: 'w2',  cat: 'experiences', emoji: '🌴', name: 'Honeymoon Trip',       price: 'any amount'},
                { id: 'w3',  cat: 'experiences', emoji: '💆', name: 'Couples Massage',      price: 'from $80' },
                { id: 'w4',  cat: 'experiences', emoji: '🍷', name: 'Wine Tasting',         price: 'from $50' },
                { id: 'w5',  cat: 'experiences', emoji: '🚢', name: 'Cruise Day',           price: 'from $120'},
                { id: 'w6',  cat: 'experiences', emoji: '🎭', name: 'Theater Night',        price: 'from $40' },
                { id: 'w7',  cat: 'learning',    emoji: '👨‍🍳', name: 'Cooking Class for Two',price: 'from $70' },
                { id: 'w8',  cat: 'learning',    emoji: '💃', name: 'Dance Lessons',        price: 'from $60' },
                { id: 'w9',  cat: 'learning',    emoji: '🏺', name: 'Pottery Workshop',     price: 'from $50' },
                { id: 'w10', cat: 'learning',    emoji: '🌿', name: 'Garden Design Class',  price: 'from $40' },
                { id: 'w11', cat: 'tech',        emoji: '📸', name: 'Extra Photo Album',    price: 'from $60' },
                { id: 'w12', cat: 'tech',        emoji: '🎵', name: 'Smart Speaker',        price: 'from $50' },
                { id: 'w13', cat: 'sports',      emoji: '🧘', name: 'Yoga Retreat',         price: 'from $80' },
                { id: 'w14', cat: 'sports',      emoji: '🚴', name: 'Cycling Tour',         price: 'from $60' },
                { id: 'w15', cat: 'books',       emoji: '🎨', name: 'Art for New Home',     price: 'from $50' },
                { id: 'w16', cat: 'books',       emoji: '📖', name: 'Our Story Book',       price: 'from $35' },
                { id: 'w17', cat: 'meaning',     emoji: '🏡', name: 'New Home Down Payment',price: 'any amount'},
                { id: 'w18', cat: 'meaning',     emoji: '🛋️', name: 'Dream Sofa Fund',      price: 'any amount'},
                { id: 'w19', cat: 'meaning',     emoji: '🌳', name: 'Plant a Tree Together',price: 'from $10' },
                { id: 'w20', cat: 'meaning',     emoji: '🐾', name: 'Adopt a Pet Together', price: 'from $30' },
            ]
        };

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
        const categoryChips  = document.querySelectorAll('.gm-chip');

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
                const card = document.createElement('div');
                card.className = `gm-gift-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`;
                card.dataset.id = gift.id;
                card.innerHTML = `
                    <div class="gm-check"><i class="fa-solid fa-check"></i></div>
                    <div class="gm-emoji">${gift.emoji}</div>
                    <div class="gm-gift-name">${gift.name}</div>
                    <div class="gm-gift-price">${gift.price}</div>
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
                tag.innerHTML = `${gift.emoji} ${gift.name} <span class="gm-tag-remove" data-id="${gift.id}">✕</span>`;
                tag.querySelector('.gm-tag-remove').addEventListener('click', () => {
                    selectedGiftIds = selectedGiftIds.filter(i => i !== id);
                    updateCounter();
                    renderGiftGrid();
                    renderSelectedTags();
                });
                giftSelectedTags.appendChild(tag);
            });
        }

        // --- CATEGORY CHIPS ---
        categoryChips.forEach(chip => {
            chip.addEventListener('click', () => {
                categoryChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                currentCategory = chip.dataset.cat;
                showAllGifts = false;
                renderGiftGrid();
            });
        });

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

        eventTypeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                currentEventType = e.target.value;
                selectedGiftIds = [];
                showAllGifts = false;
                updateCounter();
                renderGiftGrid();
                renderSelectedTags();

                if (currentEventType === 'wedding') {
                    if (fieldsSingle) fieldsSingle.style.display = 'none';
                    if (fieldsCouple) fieldsCouple.style.display = 'grid';
                    if (eventNameInput) eventNameInput.placeholder = "E.g., Sarah & Mike's Wedding";
                } else {
                    if (fieldsSingle) fieldsSingle.style.display = 'grid';
                    if (fieldsCouple) fieldsCouple.style.display = 'none';
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
            'pix': document.getElementById('pixForm'),
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
                payTotalAmount.innerText = `$${amount}`;

                // Atualiza o valor nos botões de pagamento (todos eles)
                amountDisplays.forEach(display => {
                    display.innerText = `$${amount}`;
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

        /* --- Lógica das Abas de Pagamento (Card, Pix, Apple Pay) --- */
        payTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // 1. Visual da Aba
                payTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // 2. Conteúdo: Esconde TODOS e mostra o selecionado
                Object.values(allForms).forEach(form => {
                    if (form) form.style.display = 'none';
                });

                const method = tab.getAttribute('data-method'); // 'card', 'pix' ou 'apple'
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
    }

    /* ==========================================================================
       9. MODAL: SHARE CELEBRATION
       ========================================================================== */
    const shareModal = document.getElementById('shareModal');
    const shareBtns = document.querySelectorAll('#shareBtn, #shareBtnMobile');
    const closeShareBtn = document.querySelector('.close-share-modal');
    const copyBtn = document.getElementById('copyBtn');
    const shareUrlInput = document.getElementById('shareUrl');

    if (shareModal) {
        // 1. Abrir Modal
        shareBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                shareModal.classList.add('active');
            });
        });

        // 2. Botão no rodapé das páginas públicas
        const footerShareBtn = document.querySelector('.btn-share-action');
        if (footerShareBtn) {
            footerShareBtn.addEventListener('click', (e) => {
                e.preventDefault();
                shareModal.classList.add('active');
            });
        }

        // 3. Fechar Modal
        if (closeShareBtn) {
            closeShareBtn.addEventListener('click', () => {
                shareModal.classList.remove('active');
            });
        }

        // Fechar ao clicar fora
        window.addEventListener('click', (e) => {
            if (e.target === shareModal) {
                shareModal.classList.remove('active');
            }
        });

        // 4. Lógica de Copiar Link
        if (copyBtn && shareUrlInput) {
            copyBtn.addEventListener('click', () => {
                shareUrlInput.select();
                shareUrlInput.setSelectionRange(0, 99999); // Para dispositivos móveis
                navigator.clipboard.writeText(shareUrlInput.value).then(() => {
                    const originalText = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
                    copyBtn.style.backgroundColor = '#27AE60';
                    setTimeout(() => {
                        copyBtn.innerHTML = originalText;
                        copyBtn.style.backgroundColor = '';
                    }, 2000);
                });
            });
        }
    }
    /* ==========================================================================
       10. LIVE PREVIEW: CREATOR'S CANVAS
       ========================================================================== */
    const eventNameInput = document.getElementById('event-name-input');
    const eventDescInput = document.getElementById('event-desc-input');
    const bannerInput = document.getElementById('bannerInput');
    const previewName = document.getElementById('previewDisplayName');
    const previewDesc = document.getElementById('previewDisplayDesc');
    const previewBanner = document.getElementById('previewBanner');

    // Sync Text Inputs
    if (eventNameInput && previewName) {
        eventNameInput.addEventListener('input', () => {
            previewName.textContent = eventNameInput.value || "Mauro's Party";
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
                displayEl.textContent = input.value || (targetId === 'preview-age' ? '5' : 'Dinosaur Theme');
            }
        });
    });

    // Image Upload Preview Trigger
    const uploadBox = document.getElementById('bannerUploadBox');
    if (uploadBox && bannerInput) {
        uploadBox.addEventListener('click', () => bannerInput.click());
    }

    if (bannerInput && previewBanner) {
        bannerInput.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    previewBanner.style.backgroundImage = `url(${e.target.result})`;
                    previewBanner.querySelector('.preview-overlay').style.background = 'rgba(0,0,0,0.5)';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Handle Category/Type Selection
    document.querySelectorAll('input[name="event_type"]').forEach(radio => {
        radio.addEventListener('change', () => {
            const label = radio.getAttribute('data-label');
            if (previewName && !eventNameInput.value) {
                previewName.textContent = `New ${label}`;
            }
        });
    });

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
            const emoji = '🎁';
            const newGift = { id: customId, cat: category, emoji, name: name.trim(), price: 'any amount' };
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
                    window._addCustomGift({ id: 'custom_' + Date.now(), cat, emoji: '🎁', name: name.trim(), price: 'any amount' });
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
                    window._addCustomGift({ id: 'custom_' + Date.now(), cat, emoji: '🎁', name: name.trim(), price: 'any amount' });
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