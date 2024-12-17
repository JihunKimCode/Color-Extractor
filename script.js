// Event Listeners Initialization
function initializeEventListeners() {
    const imageInput = document.getElementById('imageInput');
    const imagePlaceholder = document.getElementById('imagePlaceholder');
    const uploadedImage = document.getElementById('uploadedImage');

    // Open file input on click
    imagePlaceholder.addEventListener('click', () => imageInput.click());
    uploadedImage.addEventListener('click', () => imageInput.click());

    // Handle image upload
    imageInput.addEventListener('change', handleImageUpload);

    // Handle drag and drop
    imagePlaceholder.addEventListener('dragenter', (e) => handleDragEnter(e, imagePlaceholder));
    imagePlaceholder.addEventListener('dragover', (e) => handleDragOver(e, imagePlaceholder));
    imagePlaceholder.addEventListener('dragleave', (e) => handleDragLeave(e, imagePlaceholder));
    imagePlaceholder.addEventListener('drop', handleImageDrop);

    // Handle drag and drop
    uploadedImage.addEventListener('dragenter', (e) => handleDragEnter(e, imagePlaceholder));
    uploadedImage.addEventListener('dragover', (e) => handleDragOver(e, imagePlaceholder));
    uploadedImage.addEventListener('dragleave', (e) => handleDragLeave(e, imagePlaceholder));
    uploadedImage.addEventListener('drop', handleImageDrop);    
}

// Handle Drag Enter
function handleDragEnter(event, placeholder) {
    preventDefault(event);
    placeholder.classList.add('drag-over');
}

// Handle Drag Over
function handleDragOver(event, placeholder) {
    preventDefault(event);
    placeholder.classList.add('drag-over');
}

// Handle Drag Leave
function handleDragLeave(event, placeholder) {
    preventDefault(event);
    placeholder.classList.remove('drag-over');
}

// Handle Image Drop
function handleImageDrop(event) {
    const imagePlaceholder = document.getElementById('imagePlaceholder');
    preventDefault(event);
    imagePlaceholder.classList.remove('drag-over');

    const file = event.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) {
        alert("Please upload a valid image file.");
        return;
    }

    loadAndProcessImageFromFile(file);
}

// Handle Image Upload from Input
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
        alert("Please upload a valid image file.");
        return;
    }
    loadAndProcessImageFromFile(file);
}

// Process Image from File
function loadAndProcessImageFromFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => loadAndProcessImage(e.target.result);
    reader.readAsDataURL(file);
}

// Load and Process Image
function loadAndProcessImage(src) {
    const img = new Image();
    img.onload = () => {
        displayImage(src);
        processImageColors(img);
    };
    img.src = src;
}

// Utility to Prevent Default Behavior
function preventDefault(event) {
    event.preventDefault();     // prevent reload page & prevent to open file
    event.stopPropagation();    // Control event flow
}

// Display Uploaded Image
function displayImage(src) {
    const uploadedImage = document.getElementById('uploadedImage');
    const imagePlaceholder = document.getElementById('imagePlaceholder');

    imagePlaceholder.style.display = 'none';
    uploadedImage.src = src;
    uploadedImage.style.display = 'block';
}

// Process Image Colors
async function processImageColors(img) {
    const canvas = setCanvas(img);
    const imageData = getPixelData(canvas, img);
    const dominantColors = await extractDominantColors(imageData, 9);
    setColorPalette(dominantColors);
}

// Setup Canvas and Draw Image
function setCanvas(img) {
    const canvas = document.getElementById('imageCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    return canvas;
}

// Get Pixel Data from Canvas
function getPixelData(canvas, img) {
    const ctx = canvas.getContext('2d');
    return ctx.getImageData(0, 0, img.width, img.height); //get Pixel Data
}

// Extract Dominant Colors
async function extractDominantColors(imageData, maxColors) {
    const colorCounts = new Map();
    const { data } = imageData;

    // Count pixel colors
    for (let i = 0; i < data.length; i += 4) {
        const hex = rgbToHex(data[i], data[i + 1], data[i + 2]);
        colorCounts.set(hex, (colorCounts.get(hex) || 0) + 1);
    }
    // Sort colors by frequency and cluster them
    const sortedColors = [...colorCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([hex]) => hex);

    return clusterColors(sortedColors, maxColors);
}

// Cluster Similar Colors
function clusterColors(colors, maxColors) {
    const clusteredColors = [];
    const visited = new Set();

    for (const color of colors) {
        if (visited.has(color)) continue;

        clusteredColors.push(color);
        if (clusteredColors.length >= maxColors) break;

        // Mark similar colors as visited
        for (const otherColor of colors) {
            if (!visited.has(otherColor) && colorDistance(hexToRgb(color), hexToRgb(otherColor)) < 70) {
                visited.add(otherColor);
            }
        }
    }
    return clusteredColors;
}

// Calculate Color Distance
function colorDistance(c1, c2) {
    return Math.sqrt((c1.r - c2.r) ** 2 + (c1.g - c2.g) ** 2 + (c1.b - c2.b) ** 2);
}

// Color Palette with Color Syringe Tool
function setColorPalette(colors) {
    const paletteContainer = document.getElementById('colorPalette');
    paletteContainer.innerHTML = '';

    // Render all the colors
    colors.forEach((color, index) => {
        const colorBox = createColorBox(color);
        paletteContainer.appendChild(colorBox);

        // If this is the last color, replace it with a syringe tool
        if (index === colors.length-1 && index === 8) {
            addColorSyringeTool(colorBox, color);
        }
        // If there is less than 8 colors, append a syringe tool
        else if(index === colors.length-1 && index < 8) {
            const colorBox = createColorBox(color);
            paletteContainer.appendChild(colorBox);
            addColorSyringeTool(colorBox, color);
        }
    });
}

// Add Color Syringe Tool with a Button to the Last Color Box
function addColorSyringeTool(colorBox, initialColor) {
    // Create the color input element
    const syringeInput = document.createElement('input');
    syringeInput.type = 'color';
    syringeInput.className = 'colorSyringe';
    syringeInput.value = initialColor.toUpperCase(); // Set to last color
    syringeInput.style.visibility = 'hidden';

    // Create the button that will open the color picker
    const colorButton = document.createElement('button');
    colorButton.className = 'colorButton';
    colorButton.style.backgroundColor = syringeInput.value;
    colorButton.style.color = isDarkColor(syringeInput.value) ? '#fff' : '#000';
    colorButton.style.borderColor = isDarkColor(syringeInput.value) ? '#fff' : '#000';

    // Create the icon element
    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-eye-dropper';
    
    // When color is selected, update the color box
    syringeInput.addEventListener('input', () => {
        colorBox.style.backgroundColor = syringeInput.value;
        colorBox.querySelector('span').textContent = syringeInput.value.toUpperCase();
        colorBox.querySelector('span').style.color = isDarkColor(syringeInput.value) ? '#fff' : '#000';
        colorButton.style.backgroundColor = syringeInput.value;
        colorButton.style.color = isDarkColor(syringeInput.value) ? '#fff' : '#000';
        colorButton.style.borderColor = isDarkColor(syringeInput.value) ? '#fff' : '#000';
        initialColor = syringeInput.value;
    });

    // Append the icon to the button
    colorButton.appendChild(icon);

    // When the button is clicked, trigger the color input
    colorButton.addEventListener('click', (event) => {
        event.stopPropagation();    // Prevent colorbox is clicked
        syringeInput.click();
    });

    // Prevent colorBox click event when syringeInput is clicked
    syringeInput.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    // Add the hex value display
    const hexSpan = document.createElement('span');
    hexSpan.textContent = initialColor.toUpperCase();
    hexSpan.style.color = isDarkColor(initialColor) ? '#fff' : '#000';

    // Replace the existing content with the syringe tool and hex display
    colorBox.innerHTML = ''; // Clear previous content
    colorBox.appendChild(syringeInput);
    colorBox.appendChild(colorButton);
    colorBox.appendChild(hexSpan);

    // Add Tooltip and Copy Feature
    const tooltip = setTooltip();
    colorBox.appendChild(tooltip);
    colorBox.addEventListener('click', () => {copyHexColor(initialColor, tooltip);});
}

// Create a Single Color Box with Tooltip
function createColorBox(hex) {
    const colorBox = document.createElement('div');
    colorBox.className = 'colorBox';
    colorBox.style.backgroundColor = hex;

    const hexSpan = document.createElement('span');
    hexSpan.textContent = hex;
    hexSpan.style.color = isDarkColor(hex) ? '#fff' : '#000';

    const tooltip = setTooltip();
    colorBox.append(hexSpan, tooltip);

    colorBox.addEventListener('click', () => copyHexColor(hex, tooltip));

    return colorBox;
}

// Set Tooltip Element
function setTooltip() {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = 'Copied!';
    return tooltip;
}

// Copy color to Clipboard with Tooltip
function copyHexColor(color, tooltip) {
    navigator.clipboard.writeText(color).then(() => {
        tooltip.style.display = 'block';
        setTimeout(() => (tooltip.style.display = 'none'), 1000);
    });
}

// Convert RGB to Hex
function rgbToHex(r, g, b) {
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
}

// Convert Hex to RGB
function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

// Check if a Color is Dark
function isDarkColor(hex) {
    const { r, g, b } = hexToRgb(hex);
    return 0.299 * r + 0.587 * g + 0.114 * b < 128; // Luminance threshold
}

// Initialize the App
document.addEventListener('DOMContentLoaded', initializeEventListeners);
