document.addEventListener('DOMContentLoaded', () => {
  const processBtn = document.getElementById('processBtn');
  const nameInput = document.getElementById('macroName');
  const watermarkInput = document.getElementById('watermarkText');
  const nameColorInput = document.getElementById('macroNameColor');
  const watermarkColorInput = document.getElementById('watermarkColor');
  
  // --- DaVinci Custom Color Picker Logic ---
  const dcpModal = document.getElementById('davinciColorPicker');
  const dcpHsBox = document.getElementById('dcpHsBox');
  const dcpHsCursor = document.getElementById('dcpHsCursor');
  const dcpValOverlay = document.getElementById('dcpValOverlay');
  const dcpValSlider = document.getElementById('dcpValSlider');
  const dcpValCursor = document.getElementById('dcpValCursor');
  const dcpPreviewColor = document.getElementById('dcpPreviewColor');
  
  const dcpHue = document.getElementById('dcpHue');
  const dcpSat = document.getElementById('dcpSat');
  const dcpVal = document.getElementById('dcpVal');
  const dcpRed = document.getElementById('dcpRed');
  const dcpGreen = document.getElementById('dcpGreen');
  const dcpBlue = document.getElementById('dcpBlue');
  const dcpHtml = document.getElementById('dcpHtml');
  
  let dcpCurrentTrigger = null;
  let dcpCurrentH = 0, dcpCurrentS = 0, dcpCurrentV = 255;

  function hsvToRgb(h, s, v) {
    let r, g, b;
    h /= 360; s /= 255; v /= 255;
    let i = Math.floor(h * 6);
    let f = h * 6 - i;
    let p = v * (1 - s);
    let q = v * (1 - f * s);
    let t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0: r = v, g = t, b = p; break;
      case 1: r = q, g = v, b = p; break;
      case 2: r = p, g = v, b = t; break;
      case 3: r = p, g = q, b = v; break;
      case 4: r = t, g = p, b = v; break;
      case 5: r = v, g = p, b = q; break;
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  function rgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;
    let d = max - min;
    s = max === 0 ? 0 : d / max;
    if (max === min) { h = 0; } else {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return [Math.round(h * 360), Math.round(s * 255), Math.round(v * 255)];
  }

  function rgbToHex(r, g, b) {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).padStart(6, '0');
  }

  function hexToRgb(hex) {
    if (hex.length === 4) hex = "#" + hex[1]+hex[1]+hex[2]+hex[2]+hex[3]+hex[3];
    let bigint = parseInt(hex.replace('#',''), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  }

  function updateDcpUI(from) {
    if (from === 'rgb') {
      [dcpCurrentH, dcpCurrentS, dcpCurrentV] = rgbToHsv(dcpRed.value, dcpGreen.value, dcpBlue.value);
    } else if (from === 'hsv' || from === 'box') {
      const [r, g, b] = hsvToRgb(dcpCurrentH, dcpCurrentS, dcpCurrentV);
      dcpRed.value = r; dcpGreen.value = g; dcpBlue.value = b;
    } else if (from === 'hex') {
      const [r, g, b] = hexToRgb(dcpHtml.value);
      dcpRed.value = r; dcpGreen.value = g; dcpBlue.value = b;
      [dcpCurrentH, dcpCurrentS, dcpCurrentV] = rgbToHsv(r, g, b);
    }
    
    dcpHue.value = dcpCurrentH; dcpSat.value = dcpCurrentS; dcpVal.value = dcpCurrentV;
    const hex = rgbToHex(dcpRed.value, dcpGreen.value, dcpBlue.value);
    if (from !== 'hex') dcpHtml.value = hex;
    dcpPreviewColor.style.background = hex;
    
    dcpHsCursor.style.left = (dcpCurrentH / 360 * 256) + 'px';
    dcpHsCursor.style.top = (256 - (dcpCurrentS / 255 * 256)) + 'px';
    dcpValCursor.style.top = (256 - (dcpCurrentV / 255 * 256)) + 'px';
    
    // Update the vertical value slider gradient top color
    const [sliderR, sliderG, sliderB] = hsvToRgb(dcpCurrentH, dcpCurrentS, 255);
    dcpValSlider.style.background = `linear-gradient(to bottom, rgb(${sliderR}, ${sliderG}, ${sliderB}), #000)`;
  }

  const basicColors = ['#000000','#800000','#008000','#808000','#000080','#800080','#008080','#c0c0c0',
                       '#808080','#ff0000','#00ff00','#ffff00','#0000ff','#ff00ff','#00ffff','#ffffff',
                       '#000000','#800000','#008000','#808000','#000080','#800080','#008080','#c0c0c0',
                       '#808080','#ff0000','#00ff00','#ffff00','#0000ff','#ff00ff','#00ffff','#ffffff',
                       '#000000','#800000','#008000','#808000','#000080','#800080','#008080','#c0c0c0',
                       '#808080','#ff0000','#00ff00','#ffff00','#0000ff','#ff00ff','#00ffff','#ffffff'];
  const basicContainer = document.getElementById('dcpBasicColors');
  for (let i=0; i<48; i++) {
    const sw = document.createElement('div');
    sw.className = 'dcp-swatch';
    sw.style.background = basicColors[i % 48] || '#fff';
    sw.onclick = () => { dcpHtml.value = rgbToHex(...hexToRgb(sw.style.background)); updateDcpUI('hex'); };
    basicContainer.appendChild(sw);
  }
  
  const customContainer = document.getElementById('dcpCustomColors');
  for (let i=0; i<16; i++) {
    const sw = document.createElement('div');
    sw.className = 'dcp-swatch';
    sw.style.background = '#ffffff';
    customContainer.appendChild(sw);
  }

  let isDraggingHs = false;
  dcpHsBox.addEventListener('mousedown', (e) => { isDraggingHs = true; updateHs(e); });
  window.addEventListener('mousemove', (e) => { if (isDraggingHs) updateHs(e); });
  window.addEventListener('mouseup', () => { isDraggingHs = false; });
  
  function updateHs(e) {
    const rect = dcpHsBox.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    x = Math.max(0, Math.min(256, x));
    y = Math.max(0, Math.min(256, y));
    dcpCurrentH = Math.round(x / 256 * 360);
    dcpCurrentS = Math.round((256 - y) / 256 * 255);
    updateDcpUI('box');
  }

  let isDraggingVal = false;
  dcpValSlider.addEventListener('mousedown', (e) => { isDraggingVal = true; updateVal(e); });
  window.addEventListener('mousemove', (e) => { if (isDraggingVal) updateVal(e); });
  window.addEventListener('mouseup', () => { isDraggingVal = false; });
  
  function updateVal(e) {
    const rect = dcpValSlider.getBoundingClientRect();
    let y = e.clientY - rect.top;
    y = Math.max(0, Math.min(256, y));
    dcpCurrentV = Math.round((256 - y) / 256 * 255);
    updateDcpUI('box');
  }

  [dcpRed, dcpGreen, dcpBlue].forEach(inp => inp.addEventListener('input', () => updateDcpUI('rgb')));
  [dcpHue, dcpSat, dcpVal].forEach(inp => {
    inp.addEventListener('input', () => {
      dcpCurrentH = parseInt(dcpHue.value)||0; dcpCurrentS = parseInt(dcpSat.value)||0; dcpCurrentV = parseInt(dcpVal.value)||0;
      updateDcpUI('hsv');
    });
  });
  dcpHtml.addEventListener('input', () => updateDcpUI('hex'));

  document.getElementById('dcpCancel').addEventListener('click', () => { dcpModal.classList.add('hidden'); });
  document.getElementById('dcpOk').addEventListener('click', () => {
    dcpModal.classList.add('hidden');
    if (dcpCurrentTrigger) {
      dcpCurrentTrigger.style.background = dcpHtml.value;
      dcpCurrentTrigger.setAttribute('data-color', dcpHtml.value);
      updatePreview();
      
      if (dcpCurrentTrigger.classList.contains('nest-color-picker')) {
          dcpCurrentTrigger.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  });

  function openColorPicker(triggerEl) {
    dcpCurrentTrigger = triggerEl;
    dcpHtml.value = triggerEl.getAttribute('data-color') || '#ffffff';
    updateDcpUI('hex');
    dcpModal.classList.remove('hidden');
  }
  
  nameColorInput.addEventListener('click', () => openColorPicker(nameColorInput));
  watermarkColorInput.addEventListener('click', () => openColorPicker(watermarkColorInput));
  
  // --- End Custom Logic ---
  const urlInput = document.getElementById('youtubeLink');
  const ytTextInput = document.getElementById('youtubeText');
  const websiteInput = document.getElementById('websiteLink');
  const websiteTextInput = document.getElementById('websiteText');
  const codeInput = document.getElementById('macroCode');

  const copyBtn = document.getElementById('copyBtn');
  const base64Btn = document.getElementById('base64Btn');
  const base64Output = document.getElementById('base64Output');

  // Live Preview Elements
  const previewNodeName = document.getElementById('previewNodeName');
  const previewMacroName = document.getElementById('previewMacroName');
  const previewWatermark = document.getElementById('previewWatermark');
  const previewTutorialBtn = document.getElementById('previewTutorialBtn');
  const previewWebsiteBtn = document.getElementById('previewWebsiteBtn');
  const previewNests = document.getElementById('previewNests');
  
  // Handle individual nest color changes
  previewNests.addEventListener('input', (e) => {
    // Handle Nest Color Change
    if (e.target.classList.contains('nest-color-picker')) {
      const nestIndex = parseInt(e.target.getAttribute('data-index'));
      const newColor = e.target.value;
      
      let code = codeInput.value;
      const nestRegex = /(=\s*Input\s*\{[^{}]*Type\s*=\s*"BeginNest"[^{}]*Name\s*=\s*")((?:[^"\\]|\\.)*)("\s*,?)/gi;
      
      let currentIndex = 0;
      code = code.replace(nestRegex, (match, before, nameValue, after) => {
          if (currentIndex === nestIndex) {
              let cleanText = nameValue.replace(/\\"/g, '"');
              const fontMatch = cleanText.match(/<font color="[^"]+">([^<]+)<\/font>/i);
              if (fontMatch) cleanText = fontMatch[1];
              const newName = `<font color=\\"${newColor}\\">${cleanText}</font>`;
              currentIndex++;
              return before + newName + after;
          }
          currentIndex++;
          return match;
      });
      
      codeInput.value = code;
    }
  });

  const obfuscateToggle = document.getElementById('obfuscateToggle');

  function encodeLuaString(str) {
      let res = '';
      for (let i = 0; i < str.length; i++) {
          res += String.fromCharCode(92) + str.charCodeAt(i).toString(10).padStart(3, '0');
      }
      return res;
  }



  const pasteMacroBtn = document.getElementById('pasteMacroBtn');
  if (pasteMacroBtn) {
      pasteMacroBtn.addEventListener('click', async () => {
          try {
              const text = await navigator.clipboard.readText();
              if (text) {
                  codeInput.value = text;
                  codeInput.dispatchEvent(new Event('input'));
                  
                  const originalText = pasteMacroBtn.innerHTML;
                  pasteMacroBtn.innerHTML = `Pasted! <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
                  pasteMacroBtn.style.background = "#22c55e";
                  setTimeout(() => {
                      pasteMacroBtn.innerHTML = originalText;
                      pasteMacroBtn.style.background = "var(--primary)";
                  }, 2000);
              }
          } catch (err) {
              console.error('Failed to read clipboard: ', err);
              alert("Clipboard access denied. Please allow clipboard access in your browser or paste manually.");
          }
      });
  }

  // Handle nest open/close toggle
  previewNests.addEventListener('change', (e) => {
    if (e.target.classList.contains('nest-value-checkbox')) {
      const nestIndex = parseInt(e.target.getAttribute('data-index'));
      const newValue = e.target.checked ? 1 : 0;
      
      // Update caret direction and children visibility
      const container = e.target.closest('.resolve-nest-container');
      if (container) {
          const caret = container.querySelector('.nest-caret');
          if (caret) caret.style.transform = e.target.checked ? 'rotate(0deg)' : 'rotate(-90deg)';
          
          const childrenBox = container.querySelector('.nest-children');
          if (childrenBox) {
              childrenBox.style.display = e.target.checked ? 'block' : 'none';
          }
      }

      // Update raw code silently
      let code = codeInput.value;
      const nestRegex = /(=\s*Input\s*\{)([^{}]*Type\s*=\s*"BeginNest"[^{}]*\})/gi;
      
      let currentIndex = 0;
      code = code.replace(nestRegex, (match, before, block) => {
          if (currentIndex === nestIndex) {
              currentIndex++;
              if (/Value\s*=\s*[01]/.test(block)) {
                  block = block.replace(/(Value\s*=\s*)[01]/, `$1${newValue}`);
              } else {
                  block = block.replace(/(Type\s*=\s*"BeginNest")/, `Value = ${newValue},\n\t\t\t\t\t$1`);
              }
              return before + block;
          }
          currentIndex++;
          return match;
      });
      
      codeInput.value = code;
    } else if (e.target.classList.contains('nest-color-picker')) {
        const nestIndex = parseInt(e.target.getAttribute('data-index'));
        const newColor = e.target.getAttribute('data-color');
        
        let code = codeInput.value;
        const nestRegex = /(=\s*Input\s*\{)([^{}]*Type\s*=\s*"BeginNest"[^{}]*\})/gi;
        
        let currentIndex = 0;
        code = code.replace(nestRegex, (match, before, block) => {
            if (currentIndex === nestIndex) {
                currentIndex++;
                const nameMatch = block.match(/Name\s*=\s*"((?:[^"\\]|\\.)*)"/i);
                if (nameMatch) {
                    let cleanName = nameMatch[1].replace(/\\"/g, '"');
                    let textContent = cleanName;
                    const fontMatch = cleanName.match(/<font color="([^"]+)">([^<]+)<\/font>/i);
                    if (fontMatch) {
                        textContent = fontMatch[2];
                    }
                    const newNameStr = `<font color="${newColor}">${textContent}</font>`;
                    block = block.replace(/(Name\s*=\s*")((?:[^"\\]|\\.)*)(")/i, `$1${newNameStr.replace(/"/g, '\\"')}$3`);
                }
                return before + block;
            }
            currentIndex++;
            return match;
        });
        
        codeInput.value = code;
    }
  });

  previewNests.addEventListener('input', (e) => {
      if (e.target.classList.contains('nest-color-picker')) {
          const newColor = e.target.getAttribute('data-color');
          const container = e.target.closest('.resolve-nest');
          if (container) {
              const titleEl = container.querySelector('.nest-title');
              if (titleEl) {
                  titleEl.style.color = newColor;
              }
          }
      }
  });

  previewNests.addEventListener('click', (e) => {
      if (e.target.classList.contains('nest-color-picker')) {
          openColorPicker(e.target);
      }
  });

  function updatePreview() {
    const rawCode = codeInput.value;
    const macroName = nameInput.value.trim() || 'Custom Macro';
    const watermark = watermarkInput.value.trim();
    const ytUrl = urlInput.value.trim();
    const ytText = ytTextInput.value.trim() || 'Watch Tutorial';
    const websiteUrl = websiteInput.value.trim();
    const websiteText = websiteTextInput.value.trim() || 'Visit Website';
    
    const titleColor = nameColorInput.getAttribute('data-color') || '#ffffff';
    const wmColor = watermarkColorInput.getAttribute('data-color') || '#888888';

    // Generate valid lua identifier for internal node name
    let safeInternalName = macroName.replace(/[^a-zA-Z0-9_]/g, '');
    if (!safeInternalName) safeInternalName = "CustomMacro";
    if (/^[0-9]/.test(safeInternalName)) safeInternalName = "M_" + safeInternalName;

    // Update Text
    previewNodeName.textContent = safeInternalName;
    previewMacroName.textContent = macroName;
    previewMacroName.style.color = titleColor;
    previewWatermark.textContent = watermark;
    previewWatermark.style.color = wmColor;

    // Update Button Visibility
    if (ytUrl) {
      previewTutorialBtn.classList.remove('hidden');
      previewTutorialBtn.textContent = ytText;
    } else {
      previewTutorialBtn.classList.add('hidden');
    }
    
    if (websiteUrl) {
      previewWebsiteBtn.classList.remove('hidden');
      previewWebsiteBtn.textContent = websiteText;
    } else {
      previewWebsiteBtn.classList.add('hidden');
    }

    // Parse and render Nests
    previewNests.innerHTML = ''; // clear existing
    if (rawCode) {
      // Look for Type = "BeginNest", Type = "EndNest", EndNest = X, or InstanceInput blocks
      const regex = /Type\s*=\s*"(BeginNest|EndNest)"|EndNest\s*=\s*([0-9]+)|=\s*InstanceInput\s*\{/gi;
      let match;
      let nestIndex = 0;
      let currentParent = previewNests;

      while ((match = regex.exec(rawCode)) !== null) {
        const matchText = match[0].trim();
        let isEndNest = false;
        let closeLevels = 0;
        let isBeginNest = false;
        let isInstanceInput = false;

        if (match[1] && match[1].toLowerCase() === 'endnest') {
            isEndNest = true;
            closeLevels = 1;
        } else if (match[2]) {
            isEndNest = true;
            closeLevels = parseInt(match[2], 10);
        } else if (match[1] && match[1].toLowerCase() === 'beginnest') {
            isBeginNest = true;
        } else if (matchText.includes('InstanceInput')) {
            isInstanceInput = true;
        }

        if (isEndNest) {
            for (let i = 0; i < closeLevels; i++) {
                if (currentParent !== previewNests) {
                   currentParent = currentParent.parentElement.parentElement;
                   if (!currentParent || (!currentParent.classList.contains('nest-children') && currentParent !== previewNests)) {
                       currentParent = previewNests;
                       break;
                   }
                }
            }
            continue;
        }

        // Extract the relevant chunk of text for this block
        let block = "";
        const before = rawCode.substring(0, match.index);
        
        if (isInstanceInput) {
            let start = rawCode.indexOf('{', match.index);
            if (start === -1) start = match.index;
            block = rawCode.substring(start, start + 350);
        } else {
            let start = before.lastIndexOf('{');
            if (start === -1) start = Math.max(0, match.index - 200);
            block = rawCode.substring(start, match.index + 350);
        }

        if (isBeginNest) {
            // Extract Value = 0 or 1
            let nestValue = 1;
            const valueMatch = block.match(/Value\s*=\s*([01])/i);
            if (valueMatch) {
                nestValue = parseInt(valueMatch[1]);
            }

            // Extract Name="xyz"
            const nameMatch = block.match(/Name\s*=\s*"((?:[^"\\]|\\.)*)"/i);
            if (nameMatch) {
              let cleanName = nameMatch[1].replace(/\\"/g, '"'); 
              
              let textContent = cleanName;
              let colorToUse = '#d1d1d1';

              const fontMatch = cleanName.match(/<font color="([^"]+)">([^<]+)<\/font>/i);
              if (fontMatch) {
                 colorToUse = fontMatch[1];
                 textContent = fontMatch[2];
              }

              const container = document.createElement('div');
              container.className = 'resolve-nest-container';

              const nestEl = document.createElement('div');
              nestEl.className = 'resolve-nest';
              nestEl.innerHTML = `
                <div class="nest-left">
                  <svg class="nest-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: ${nestValue === 1 ? 'rotate(0deg)' : 'rotate(-90deg)'}; transition: transform 0.2s;"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  <span class="nest-title" style="color: ${colorToUse}">${textContent}</span>
                </div>
                <div class="nest-controls">
                  <div class="nest-toggle-wrapper">
                    <span class="nest-toggle-label">Open</span>
                    <label class="nest-toggle" title="Default Open/Close State">
                      <input type="checkbox" class="nest-value-checkbox" data-index="${nestIndex}" ${nestValue === 1 ? 'checked' : ''} />
                      <span class="slider"></span>
                    </label>
                  </div>
                  <div class="color-trigger nest-color-picker" data-index="${nestIndex}" style="width: 24px; height: 24px; border: 1px solid var(--panel-border); border-radius: 4px; cursor: pointer; background: ${colorToUse};" data-color="${colorToUse}" title="Change color for this nest"></div>
                </div>
              `;
              
              const childrenBox = document.createElement('div');
              childrenBox.className = 'nest-children';
              if (nestValue === 0) childrenBox.style.display = 'none';
              childrenBox.style.paddingLeft = '18px';
              
              container.appendChild(nestEl);
              container.appendChild(childrenBox);
              currentParent.appendChild(container);
              
              currentParent = childrenBox;
              nestIndex++;
            }
        } else if (isInstanceInput) {
            let sourceOp = "";
            const sourceOpMatch = block.match(/SourceOp\s*=\s*"([^"]+)"/i);
            if (sourceOpMatch) sourceOp = sourceOpMatch[1];
            
            let sourceName = "";
            const sourceMatch = block.match(/Source\s*=\s*"([^"]+)"/i);
            if (sourceMatch) sourceName = sourceMatch[1];

            if (sourceName && sourceOp) {
                if (sourceOp.toLowerCase().includes('piperouter')) {
                    continue; // Skip rendering media inputs like PipeRouter in the inspector
                }
                
                const sLower = sourceName.toLowerCase();
                
                // Skip secondary grouped controls (DaVinci uses ControlGroup internally)
                if (sLower.includes('flipvert') || sLower.includes('green') || sLower.includes('blue') || sLower.includes('alpha')) {
                    continue;
                }

                let displayName = sourceName;
                const nameMatch = block.match(/Name\s*=\s*"((?:[^"\\]|\\.)*)"/i);
                if (nameMatch) {
                    displayName = nameMatch[1].replace(/\\"/g, '"');
                }

                let textContent = displayName;
                
                // If it's a primary grouped control without a custom name, clean it up
                if (!nameMatch) {
                    if (sLower.includes('fliphoriz')) textContent = textContent.replace(/Horiz/i, '').trim() || 'Flip';
                    if (sLower.includes('red')) textContent = textContent.replace(/Red/i, '').replace(/TopLeft/i, 'Color').trim() || 'Color';
                }

                let colorToUse = '#b0b0b0';

                const fontMatch = displayName.match(/<font color="([^"]+)">([^<]+)<\/font>/i);
                if (fontMatch) {
                    colorToUse = fontMatch[1];
                    textContent = fontMatch[2];
                }

                // Heuristics to build the fake UI html
                let uiHtml = '';
                const tLower = textContent.toLowerCase();

                if (tLower.includes('center') || sLower.includes('center') || tLower.includes('position')) {
                    uiHtml = `<span style="margin-right:4px;">X</span><div class="fake-input">0.5</div>
                              <span style="margin-left:8px; margin-right:4px;">Y</span><div class="fake-input">0.5</div>
                              <div class="fake-diamond"></div>`;
                } else if (tLower.includes('angle') || sLower.includes('angle')) {
                    uiHtml = `<div class="fake-dial-track"></div>
                              <div class="fake-input">0.0</div>
                              <div class="fake-diamond"></div>`;
                } else if (tLower.includes('mode') || sLower.includes('mode') || sourceOp.toLowerCase().includes('switch') || sLower.includes('switch') || tLower.includes('switch') || tLower.includes('shake') || sLower.includes('shake')) {
                    uiHtml = `<div class="fake-segmented-control">
                                <div class="fake-segment">Opt 1</div>
                                <div class="fake-segment active">Opt 2</div>
                              </div>
                              <div class="fake-diamond"></div>`;
                } else if (tLower.includes('use') || sLower.includes('use') || tLower.includes('show') || tLower.includes('enable')) {
                    uiHtml = `<div class="fake-checkbox checked"></div><span style="font-size:11px; margin-left:4px;">${textContent}</span>`;
                } else if (tLower.includes('flip') || sLower.includes('flip')) {
                    uiHtml = `<div class="fake-button">◀▶</div><div class="fake-button">▲▼</div><div class="fake-diamond"></div>`;
                } else if (tLower.includes('color') || sLower.includes('color') || tLower.includes('red') || tLower.includes('blue') || tLower.includes('green') || tLower.includes('alpha')) {
                    uiHtml = `<div class="fake-color-box"></div>`;
                } else {
                    // Default: Slider
                    uiHtml = `<div class="fake-slider-track"><div class="fake-slider-thumb"></div></div>
                              <div class="fake-input">1.0</div>
                              <div class="fake-diamond"></div>`;
                }

                const controlEl = document.createElement('div');
                controlEl.className = 'control-row';
                
                controlEl.innerHTML = `
                  <div class="control-label" style="color:${colorToUse}">${(tLower.includes('use') || tLower.includes('show')) ? '' : textContent}</div>
                  <div class="control-inputs">${uiHtml}</div>
                `;
                
                // Append this control inside the current nest!
                currentParent.appendChild(controlEl);
            }
        }
      }
    }
  }

  // Attach event listeners for real-time preview
  nameInput.addEventListener('input', updatePreview);
  watermarkInput.addEventListener('input', updatePreview);
  urlInput.addEventListener('input', updatePreview);
  ytTextInput.addEventListener('input', updatePreview);
  websiteInput.addEventListener('input', updatePreview);
  websiteTextInput.addEventListener('input', updatePreview);
  codeInput.addEventListener('input', updatePreview);

  // Initialize preview on load
  updatePreview();

  function processMacro(useObfuscation = false) {
    let rawCode = codeInput.value;
    const macroName = nameInput.value.trim() || 'Custom Macro';
    const watermarkText = watermarkInput.value.trim();
    const ytUrl = urlInput.value.trim();
    const websiteUrl = websiteInput.value.trim();
    const titleColor = nameColorInput.getAttribute('data-color') || '#ffffff';
    const wmColor = watermarkColorInput.getAttribute('data-color') || '#888888';

    if (!rawCode) {
      alert('Please paste your DaVinci Resolve macro code first.');
      return null;
    }
    
    // ... [Original Minify and Header Logic is unchanged up to here, skipping re-writing those chunks]
    
    // We will do a separate edit for the processMacro logic below

    // 0. Rename the macro internally so DaVinci Resolve recognizes the new name
    const macroMatch = rawCode.match(/(\w+)\s*=\s*MacroOperator\s*\{/);
    if (macroMatch) {
      const originalMacroName = macroMatch[1];
      let safeInternalName = macroName.replace(/[^a-zA-Z0-9_]/g, '');
      if (!safeInternalName) safeInternalName = "CustomMacro";
      if (/^[0-9]/.test(safeInternalName)) safeInternalName = "M_" + safeInternalName;

      rawCode = rawCode.replace(new RegExp(originalMacroName + '(\\s*=\\s*MacroOperator\\s*\\{)'), safeInternalName + '$1');
      rawCode = rawCode.replace(new RegExp(`ActiveTool\\s*=\\s*"${originalMacroName}"`), `ActiveTool = "${safeInternalName}"`);
    }

    // 1. Ensure UserControls block exists
    if (!rawCode.includes('UserControls = ordered() {')) {
      rawCode = rawCode.replace(/(=\s*MacroOperator\s*\{)/, `$1\n\t\t\tUserControls = ordered() {\n\t\t\t},`);
    }

    // 2. Inject HTML Header and Watermark
    // First, clean up any previous injected watermark to prevent duplicates
    rawCode = rawCode.replace(/MacroWatermark\s*=\s*\{[^{}]*\},\s*/g, '');

    let rawHtml = `<center><h1 style="margin-bottom: 0;"><font color="${titleColor}">${macroName}</font></h1></center>`;
    if (watermarkText) {
      rawHtml = `<center><h1 style="margin-bottom: 0;"><font color="${titleColor}">${macroName}</font></h1><font color="${wmColor}">${watermarkText}</font></center>`;
    }
    
    let finalString = rawHtml.replace(/"/g, '\\"');
    if (useObfuscation) {
      finalString = encodeLuaString(rawHtml);
    }
    
    let headerHtml = `"${finalString}"`;
    
    const headerCode = `
            MacroHeader = {
                INPID_InputControl = "LabelControl",
                LINKID_DataType = "Number",
                LBLC_MultiLine = true,
                IC_NoLabel = true,
                INP_Passive = true,
                IC_NoReset = true,
                INP_External = false,
                LINKS_Name = ${headerHtml},
                IC_ControlPage = -1,
            },`;

    const hasHeader = rawCode.includes('MacroHeader = {');
    
    if (!hasHeader) {
        let injectStr = '\n' + headerCode;
        rawCode = rawCode.replace(/(UserControls\s*=\s*ordered\(\)\s*\{)/, `$1${injectStr}`);
    } else {
        // If header exists, update it
        rawCode = rawCode.replace(/MacroHeader\s*=\s*\{[^{}]*LINKS_Name\s*=\s*[^,]*,\s*[^{}]*\}/gi, headerCode.trim());
    }

    // 3. Fix any Lua syntax errors (like 'False' instead of 'false' from previous Python scripts)
    rawCode = rawCode.replace(/=\s*False,/g, '= false,');
    rawCode = rawCode.replace(/=\s*True,/g, '= true,');

    // 4. Inject or Update Buttons if URL is provided
    let buttonsCode = '';
    const bothButtons = ytUrl && websiteUrl;
    const btnWidth = bothButtons ? 0.5 : 1.0;
    
    const finalYtText = ytTextInput.value.trim() || 'Watch Tutorial';
    const finalWebText = websiteTextInput.value.trim() || 'Visit Website';

    if (websiteUrl) {
        let webName = finalWebText;
        let webExe = `bmd.openurl("${websiteUrl}")`;
        
        if (useObfuscation) {
            webName = encodeLuaString(finalWebText);
            webExe = `bmd.openurl("${encodeLuaString(websiteUrl)}")`;
        }

        buttonsCode += `
            WebsiteButton = {
                INPID_InputControl = "ButtonControl",
                INP_Integer = false,
                INP_MinScale = 0,
                INP_MaxScale = 1,
                INP_MinAllowed = -1000000,
                INP_MaxAllowed = 1000000,
                INP_SplineType = "Default",
                ICD_Width = ${btnWidth},
                LINKID_DataType = "Number",
                LINKS_Name = "${webName}",
                BTNCS_Execute = [[
                    ${webExe}
                ]],
                ICS_ControlPage = "Controls",
                INP_External = false,
            },`;
    }

    if (ytUrl) {
        let ytName = finalYtText;
        let ytExe = `bmd.openurl("${ytUrl}")`;
        
        if (useObfuscation) {
            ytName = encodeLuaString(finalYtText);
            ytExe = `bmd.openurl("${encodeLuaString(ytUrl)}")`;
        }

        buttonsCode += `
            TutorialButton = {
                INPID_InputControl = "ButtonControl",
                INP_Integer = false,
                INP_MinScale = 0,
                INP_MaxScale = 1,
                INP_MinAllowed = -1000000,
                INP_MaxAllowed = 1000000,
                INP_SplineType = "Default",
                ICD_Width = ${btnWidth},
                LINKID_DataType = "Number",
                LINKS_Name = "${ytName}",
                BTNCS_Execute = [[
                    ${ytExe}
                ]],
                ICS_ControlPage = "Controls",
                INP_External = false,
            },`;
    }
    
    // Remove old buttons if they exist
    rawCode = rawCode.replace(/TutorialButton\s*=\s*\{[^{}]*BTNCS_Execute[^{}]*\},\s*/gi, '');
    rawCode = rawCode.replace(/WebsiteButton\s*=\s*\{[^{}]*BTNCS_Execute[^{}]*\},\s*/gi, '');

    if (buttonsCode) {
        rawCode = rawCode.replace(/(UserControls\s*=\s*ordered\(\)\s*\{)/, `$1\n${buttonsCode}`);
    }

    // 4. Do not minify (as requested by user)
    const finalCode = rawCode;
    return { minifiedCode: finalCode, macroName };
  }

  processBtn.addEventListener('click', () => {
    let outputCode = "";
    let safeFilename = "";
    
    const result = processMacro(obfuscateToggle && obfuscateToggle.checked);
    if (!result) return;
    
    outputCode = result.minifiedCode;
    safeFilename = result.macroName.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '_Updated.setting';

    // Trigger File Download
    const blob = new Blob([outputCode], { type: 'text/plain' });
    const downloadUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = safeFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);

    // Provide visual feedback
    const originalText = processBtn.innerHTML;
    processBtn.innerHTML = 'Downloaded! ✓';
    processBtn.style.background = '#10b981'; // green
    setTimeout(() => {
      processBtn.innerHTML = originalText;
      processBtn.style.background = '';
    }, 3000);
  });

  copyBtn.addEventListener('click', async () => {
    const result = processMacro(obfuscateToggle && obfuscateToggle.checked);
    if (!result) return;
    
    let outputCode = result.minifiedCode;
    
    try {
      await navigator.clipboard.writeText(outputCode);
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = 'Copied! ✓';
      copyBtn.style.background = 'rgba(16, 185, 129, 0.2)';
      copyBtn.style.color = '#10b981';
      copyBtn.style.borderColor = '#10b981';
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
        copyBtn.style = '';
      }, 3000);
    } catch (err) {
      alert('Failed to copy to clipboard.');
    }
  });
});
