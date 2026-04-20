let currentStep = 1;
const totalSteps = 9;
const cakeChoices = {};
let selectedItem = null;
let currentCategory = 'cakes';
let savedItemName = '';
let savedCategory = '';

function startTour() {
    const modal = document.getElementById("tourModal");
    modal.style.display = "flex";
    setTimeout(() => {
        modal.classList.add("open");
    }, 10);
}

function closeTour() {
    const modal = document.getElementById("tourModal");
    modal.classList.remove("open");
    setTimeout(() => {
        modal.style.display = 'none';
    }, 400);
}

// Hide header on tap, show on scroll
let lastScroll = 0;
const header = document.querySelector('.main-header');

// Hide when tapping screen
document.body.addEventListener('click', function(e) {
    if (!e.target.closest('.main-header') && 
        !e.target.closest('.chat-container') &&
        !e.target.closest('.cake-card')) {
        header.style.transform = 'translateY(-100%)';
        header.style.transition = 'transform 0.3s ease';
    }
});

// Show when scrolling
window.addEventListener('scroll', function() {
    const currentScroll = window.scrollY;
    if (currentScroll < lastScroll) {
        header.style.transform = 'translateY(0)';
    }
    lastScroll = currentScroll;
});

// Lightbox
function openPhoto(img) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = img.src;
    lightbox.style.display = 'flex';
    setTimeout(() => lightbox.classList.add('open'), 10);
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('open');
    setTimeout(() => lightbox.style.display = 'none', 300);
}

// Draggable chat container
const chatContainer = document.querySelector('.chat-container');
let isDragging = false;
let offsetX, offsetY;
let startX, startY;

chatContainer.addEventListener('touchstart', function(e) {
    isDragging = false;
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    offsetX = touch.clientX - chatContainer.getBoundingClientRect().left;
    offsetY = touch.clientY - chatContainer.getBoundingClientRect().top;
});

chatContainer.addEventListener('touchmove', function(e) {
    e.preventDefault();
    const touch = e.touches[0];

    // Only mark as dragging if moved more than 10px
    if (Math.abs(touch.clientX - startX) > 10 || 
        Math.abs(touch.clientY - startY) > 10) {
        isDragging = true;
    }

    if (!isDragging) return;

    const containerWidth = chatContainer.offsetWidth;
    const containerHeight = chatContainer.offsetHeight;

    const maxX = window.innerWidth - containerWidth;
    const maxY = window.innerHeight - containerHeight;

    let x = touch.clientX - offsetX;
    let y = touch.clientY - offsetY;

    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));

    chatContainer.style.left = x + 'px';
    chatContainer.style.top = y + 'px';
    chatContainer.style.bottom = 'auto';
}, { passive: false });

chatContainer.addEventListener('touchend', function() {
    if (!isDragging) {
        startTour();
    } else {
        // Snap to nearest edge
        const containerWidth = chatContainer.offsetWidth;
        const containerHeight = chatContainer.offsetHeight;
        const rect = chatContainer.getBoundingClientRect();
        
        const centerX = rect.left + containerWidth / 2;
        const centerY = rect.top + containerHeight / 2;
        
        const snapLeft = centerX < window.innerWidth / 2;
        
        if (snapLeft) {
            chatContainer.style.left = '10px';
        } else {
            chatContainer.style.left = (window.innerWidth - containerWidth - 10) + 'px';
        }
        
        // Keep Y within bounds
        const maxY = window.innerHeight - containerHeight - 10;
        let y = rect.top;
        y = Math.max(10, Math.min(y, maxY));
        chatContainer.style.top = y + 'px';
        chatContainer.style.bottom = 'auto';
        
        // Smooth snap animation
        chatContainer.style.transition = 'left 0.3s ease, top 0.1s ease';
        setTimeout(() => {
            chatContainer.style.transition = '';
        }, 300);
    }
    isDragging = false;
});

const galleryData = {
    cakes: [
        { img: 'cake1.jpg', name: 'Custom Design' },
        { img: 'cake2.jpg', name: 'Birthday Cake' },
        { img: 'cake3.jpg', name: 'Elegant White' },
        { img: 'cake4.jpg', name: 'Wedding Tier' },
        { img: 'hey.jpg', name: 'Butterfly Theme' },
        { img: 'cake6.jpg', name: 'Signature Barbie Cake' },
        { img: 'cake7.jpg', name: 'Princess Cake' },
        { img: 'cake8.jpg', name: 'Elegant Decadent' },
        { img: 'cake9.jpg', name: 'Spider-man Theme' },
        { img: 'cake10.jpg', name: 'Custom Design' },
    ],
    donuts: [
        { img: 'donut1.jpg', name: 'Glazed Donut' },
        { img: 'donut2.jpg', name: 'Sprinkle Donut' },
    ],
    meatpie: [
        { img: 'meatpie1.jpg', name: 'Classic Meat Pie' },
        { img: 'meatpie2.jpg', name: 'Mini Meat Pie' },
    ],
    chinchin: [
        { img: 'chinchin1.jpg', name: 'Classic Chin Chin' },
        { img: 'chinchin2.jpg', name: 'Spicy Chin Chin' },
    ],
    sausages: [
        { img: 'sausage1.jpg', name: 'Grilled Sausage' },
        { img: 'sausage2.jpg', name: 'Peppered Sausage' },
    ],
};


function openGallery() {
    closeTour();
    setTimeout(() => {
        const modal = document.getElementById('galleryModal');
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('open'), 10);
        switchCategory('cakes', document.querySelector('.cat-tab'));
    }, 400);
}

function closeGallery() {
    const modal = document.getElementById('galleryModal');
    modal.classList.remove('open');
    setTimeout(() => modal.style.display = 'none', 400);
    selectedItem = null;
    document.getElementById('orderThisBar').style.display = 'none';
}

function switchCategory(category, tabEl) {
    currentCategory = category;
    selectedItem = null;
    document.getElementById('orderThisBar').style.display = 'none';

    // Update active tab
    document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
    tabEl.classList.add('active');

    // Render photos
    const grid = document.getElementById('galleryGrid');
    grid.innerHTML = '';
    galleryData[category].forEach((item, index) => {
        grid.innerHTML += `
            <div class="gallery-item" onclick="selectItem(this, '${item.name}', ${index})">
                <img src="${item.img}" alt="${item.name}">
                <div class="check">✓</div>
            </div>
        `;
    });
}

function selectItem(el, name, index) {
    document.querySelectorAll('.gallery-item').forEach(i => i.classList.remove('selected'));
    el.classList.add('selected');
    selectedItem = { name, category: currentCategory };
    document.getElementById('selectedItemName').textContent = name;
    document.getElementById('orderThisBar').style.display = 'flex';
}

function proceedToOrder() {
    const itemToOrder = selectedItem; // save it first
    closeGallery();
    setTimeout(() => {
        openOrder(itemToOrder); // use saved copy
    }, 500);
}

function openOrder(item) {
    const modal = document.getElementById('orderModal');
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('open'), 10);

    if (item) {
        document.getElementById('selectedItemField').value = item.name;
        const isCake = item.category === 'cakes';
        document.getElementById('cakeFields').style.display = isCake ? 'flex' : 'none';
        document.getElementById('snackFields').style.display = isCake ? 'none' : 'flex';
    } else {
        // Opened directly - show cake fields by default
        document.getElementById('selectedItemField').value = '';
        document.getElementById('cakeFields').style.display = 'flex';
        document.getElementById('snackFields').style.display = 'none';
    }
}
function closeOrder() {
    const modal = document.getElementById('orderModal');
    modal.classList.remove('open');
    setTimeout(() => modal.style.display = 'none', 400);
}

function selectFlavour(btn) {
    document.querySelectorAll('.flavour-btn').forEach(b => 
    b.classList.remove('selected'));
    btn.classList.add('selected');
}

function sendOrder() {
    const name = document.getElementById('customerName').value;
    const phone = document.getElementById('customerPhone').value;
    const item = document.getElementById('selectedItemField').value;
    const requests = document.getElementById('specialRequests').value;
    const location = document.getElementById('deliveryLocation').value;
    const deliveryTime = document.getElementById('deliveryTime').value;
    const hearAboutUs = document.getElementById('hearAboutUs').value;

    if (!name || !phone) {
        alert('Please fill in your name and phone number!');
        return;
}

    const isCake = document.getElementById('cakeFields').style.display !== 'none';
    let extraDetails = '';

    if (isCake) {
        const flavour = document.querySelector('.flavour-btn.selected')?.textContent || 'Not selected';
        const tiers = document.getElementById('tiers').value;
        const date = document.getElementById('eventDate').value;
        extraDetails = `*Flavour:* ${flavour}%0A*Tiers:* ${tiers}%0A*Event Date:* ${date}%0A`;
    } else {
        const quantity = document.getElementById('quantity').value;
        const date = document.getElementById('snackDate').value;
        extraDetails = `*Quantity:* ${quantity}%0A*Delivery Date:* ${date}%0A`;
    }

    const message = `Hi Pea! I'd like to place an order %0A%0A*Name:* ${name}%0A*Phone:* ${phone}%0A*Item:* ${item || 'Not specified'}%0A${extraDetails}*Delivery Location:* ${location}%0A*Delivery Time:* ${deliveryTime}%0A*Special Requests:* ${requests}%0A*Heard About Us:* ${hearAboutUs}`;

    window.open(`https://api.whatsapp.com/send?phone=2348084340513&text=${message}`, '_blank');
}

function openCustomize() {
    closeTour();
    setTimeout(() => {
        const modal = document.getElementById('customizeModal');
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('open'), 10);
        resetCustomize();
    }, 400);
}

function closeCustomize() {
    const modal = document.getElementById('customizeModal');
    modal.classList.remove('open');
    setTimeout(() => modal.style.display = 'none', 400);
}

function resetCustomize() {
    currentStep = 1;
    Object.keys(cakeChoices).forEach(k => delete cakeChoices[k]);
    document.querySelectorAll('.option-btn').forEach(b => 
        b.classList.remove('selected'));
    showStep(1);
}

function showStep(step) {
    document.querySelectorAll('.step').forEach(s => 
        s.classList.remove('active'));
    document.getElementById('step' + step).classList.add('active');

    // Update progress
    const progress = (step / totalSteps) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('stepCounter').textContent = 
        `Step ${step} of ${totalSteps}`;

    // Show/hide back button
    document.getElementById('backBtn').style.display = 
        step === 1 ? 'none' : 'block';

    // Change next button text on last step
    document.getElementById('nextBtn').textContent = 
        step === totalSteps ? 'Send Order 🎀' : 'Next →';
}

function selectOption(btn, type) {
    btn.classList.toggle('selected');
    
    // Collect all selected options for this type
    const parent = btn.closest('.option-grid');
    const selected = [...parent.querySelectorAll('.option-btn.selected')]
        .map(b => b.textContent.trim());
    
    cakeChoices[type] = selected.join(', ');
}

function nextStep() {
    if (currentStep === totalSteps) {
        sendCustomOrder();
        return;
    }
    currentStep++;
    showStep(currentStep);
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

function sendCustomOrder() {
    const name = document.getElementById('customName').value;
    const phone = document.getElementById('customPhone').value;
    const date = document.getElementById('customDate').value;
    const message = document.getElementById('cakeMessage').value;
    const location = document.getElementById('customLocation').value;
    const deliveryTime = document.getElementById('customDeliveryTime').value;

    if (!name || !phone) {
        alert('Please fill in your name and phone number!');
        return;
    }

    const text = encodeURIComponent(
    'Hi Pea! I\'d like to customize a cake\n\n' +
    'Name: ' + name + '\n' +
    'Phone: ' + phone + '\n' +
    'Theme: ' + (cakeChoices.theme || 'Not selected') + '\n' +
    'Flavour: ' + (cakeChoices.flavour || 'Not selected') + '\n' +
    'Decoration: ' + (cakeChoices.decoration || 'Not selected') + '\n' +
    'Tiers: ' + (cakeChoices.tiers || 'Not selected') + '\n' +
    'Colour: ' + (cakeChoices.colour || 'Not selected') + '\n' +
    'Candles: ' + (cakeChoices.candles || 'Not selected') + '\n' +
    'Message on Cake: ' + (message || 'None') + '\n' +
    'Event Date: ' + date + '\n' +
    'Delivery Location: ' + location + '\n' +
    'Delivery Time: ' + deliveryTime + '\n' +
    'Reference Photo: ' + (uploadedPhoto ? 'Yes - will send on WhatsApp' : 'None')
);
           window.open(`https://api.whatsapp.com/send?phone=2348084340513&text=${text}`, '_blank');
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

let uploadedPhoto = null;

function previewPhoto(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedPhoto = e.target.result;
            document.getElementById('photoPreview').src = e.target.result;
            document.getElementById('photoPreview').style.display = 'block';
            document.getElementById('uploadPlaceholder').style.display = 'none';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function skipPhotoStep() {
    uploadedPhoto = null;
    nextStep();
}

function skipPhotoStep() {
    uploadedPhoto = null;
    currentStep++;
    if (currentStep > totalSteps) {
        sendCustomOrder();
    } else {
        showStep(currentStep);
    }
}