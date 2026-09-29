/**
 * 臺灣高中生每日水足跡計算器 App Logic
 * 108 課綱地理與環境議題 SPA
 */

// Master Schema & Coefficients
const APP_DATA = {
  "categories": [
    {
      "id": "direct_water",
      "title": "個人衛浴與清潔 (直接用水)",
      "icon": "shower-head",
      "questions": [
        {
          "id": "shower_type",
          "label": "洗澡方式",
          "type": "single_choice",
          "icon": "bath",
          "subtext": "💡 說明：選擇「淋浴」的水耗量將在下一題根據您的「淋浴時間」精確計算（每分鐘 10 公升），因此此處基礎固定加值為 0 公升。",
          "options": [
            { "value": "shower", "label": "淋浴 (基礎0L，依洗澡時間計算)", "footprint_liters": 0, "emoji": "🚿" },
            { "value": "bath", "label": "泡澡 (固定浴缸容量 +180L)", "footprint_liters": 180, "emoji": "🛁" }
          ]
        },
        {
          "id": "shower_duration",
          "label": "淋浴時間 (分鐘)",
          "type": "number_slider",
          "icon": "timer",
          "min": 1,
          "max": 60,
          "default": 15,
          "unit": "分鐘",
          "multiplier": 10
        },
        {
          "id": "teeth_brushing",
          "label": "刷牙洗臉習慣",
          "type": "single_choice",
          "icon": "sparkle",
          "options": [
            { "value": "running_water", "label": "水龍頭一直開著", "footprint_liters": 12, "emoji": "🚰" },
            { "value": "cup_and_basin", "label": "會用漱口杯或水盆蓄水", "footprint_liters": 1, "emoji": "🥤" }
          ]
        },
        {
          "id": "laundry_share",
          "label": "洗衣服頻率",
          "type": "single_choice",
          "icon": "washing-machine",
          "options": [
            { "value": "daily", "label": "每天洗 (或丟宿舍洗衣機)", "footprint_liters": 60, "emoji": "👕" },
            { "value": "few_days", "label": "2~3 天洗一次", "footprint_liters": 30, "emoji": "🧺" },
            { "value": "family_share", "label": "家人統一洗 (多件分攤)", "footprint_liters": 20, "emoji": "🏠" }
          ]
        }
      ]
    },
    {
      "id": "diet_water",
      "title": "飲食與飲料 (飲食虛擬水)",
      "icon": "utensils",
      "questions": [
        {
          "id": "lunch_meal",
          "label": "午餐 / 晚餐主菜選擇",
          "type": "single_choice",
          "icon": "utensils",
          "options": [
            { "value": "beef_bento", "label": "牛肉麵 / 牛肉便當", "footprint_liters": 2000, "emoji": "🥩" },
            { "value": "pork_bento", "label": "炸排骨便當 / 滷排骨便當", "footprint_liters": 900, "emoji": "🍱" },
            { "value": "chicken_bento", "label": "炸雞腿便當 / 雞排便當", "footprint_liters": 650, "emoji": "🍗" },
            { "value": "fish_bento", "label": "魚排便當 / 海鮮麵", "footprint_liters": 400, "emoji": "🐟" },
            { "value": "vege_bento", "label": "蔬食 / 素食便當", "footprint_liters": 250, "emoji": "🥗" }
          ]
        },
        {
          "id": "daily_drinks",
          "label": "今天喝了什麼飲料？(可多選)",
          "type": "multiple_choice",
          "icon": "cup-soda",
          "options": [
            { "value": "boba_tea", "label": "珍珠奶茶 / 加料手搖 (1杯)", "footprint_liters": 500, "emoji": "🧋" },
            { "value": "milk_tea", "label": "鮮奶茶 / 拿鐵 (1杯)", "footprint_liters": 450, "emoji": "🥛" },
            { "value": "pure_tea", "label": "無糖純茶 (1杯)", "footprint_liters": 150, "emoji": "🍵" },
            { "value": "americano", "label": "美式咖啡 (1杯)", "footprint_liters": 140, "emoji": "☕" },
            { "value": "soda_can", "label": "罐裝汽水 / 運動飲料 (1罐)", "footprint_liters": 100, "emoji": "🥤" }
          ]
        },
        {
          "id": "breakfast_egg",
          "label": "早餐或點心有包含雞蛋嗎？",
          "type": "single_choice",
          "icon": "egg",
          "options": [
            { "value": "no_egg", "label": "沒有", "footprint_liters": 0, "emoji": "❌" },
            { "value": "one_egg", "label": "有 (蛋餅/荷包蛋 1顆)", "footprint_liters": 200, "emoji": "🍳" },
            { "value": "two_eggs", "label": "有 (2顆以上)", "footprint_liters": 400, "emoji": "🥚" }
          ]
        }
      ]
    },
    {
      "id": "lifestyle_water",
      "title": "學習與日常消費 (消費虛擬水)",
      "icon": "shopping-bag",
      "questions": [
        {
          "id": "paper_sheets",
          "label": "今天使用了多少張紙？(含考卷、講義、筆記本)",
          "type": "number_slider",
          "icon": "file-text",
          "min": 0,
          "max": 50,
          "default": 10,
          "unit": "張",
          "multiplier": 10
        },
        {
          "id": "clothing_habit",
          "label": "買新衣服/鞋子的頻率",
          "type": "single_choice",
          "icon": "shirt",
          "options": [
            { "value": "rarely", "label": "幾乎不買 (1個月小於1件)", "footprint_liters": 30, "emoji": "👕" },
            { "value": "moderate", "label": "偶爾買 (1個月 2~3 件)", "footprint_liters": 150, "emoji": "🛍️" },
            { "value": "fast_fashion", "label": "快時尚愛好者 (1個月 4 件以上)", "footprint_liters": 400, "emoji": "💃" }
          ]
        }
      ]
    }
  ],
  "result_tiers": [
    {
      "min": 0,
      "max": 1500,
      "badge": "節水省長 🏆",
      "summary": "太厲害了！你的水足跡非常低，是保護地球水資源的楷模！",
      "tip": "繼續保持優良習慣，也可以試著把你的省水秘訣分享給同班同學！"
    },
    {
      "min": 1501,
      "max": 2500,
      "badge": "標準水星人 🌊",
      "summary": "你的水足跡屬於臺灣高中生的平均水準！",
      "tip": "嘗試將『鮮奶茶』換成『無糖純茶』，或是洗澡減少 3 分鐘，就能輕鬆擠進『節水省長』行列！"
    },
    {
      "min": 2501,
      "max": 99999,
      "badge": "隱形吃水怪獸 👾",
      "summary": "哇！你今天的隱形水足跡有點高喔！可能是肉類或手搖飲默默消耗了好多水！",
      "tip": "試著一週安排一天『無肉日』，或者使用漱口杯刷牙，就能大大減少你的隱形水足跡！"
    }
  ]
};

// Global App State
let currentStepIndex = 0;
let userAnswers = {};
let categoryChartInstance = null;
let comparisonChartInstance = null;

// Initialize default values for questions
function initDefaultAnswers() {
  userAnswers = {};
  APP_DATA.categories.forEach(cat => {
    cat.questions.forEach(q => {
      if (q.type === 'number_slider') {
        userAnswers[q.id] = q.default;
      } else if (q.type === 'single_choice') {
        userAnswers[q.id] = q.options[0].value;
      } else if (q.type === 'multiple_choice') {
        userAnswers[q.id] = [q.options[0].value];
      }
    });
  });
}

// Start Quiz
function startQuiz() {
  initDefaultAnswers();
  currentStepIndex = 0;

  document.getElementById('welcomeScreen').classList.add('hidden');
  document.getElementById('resultScreen').classList.add('hidden');
  document.getElementById('quizScreen').classList.remove('hidden');

  renderStep();
}

// Render Current Category Step
function renderStep() {
  const category = APP_DATA.categories[currentStepIndex];
  const totalSteps = APP_DATA.categories.length;

  // Update Progress Header
  document.getElementById('categoryBadge').textContent = `步驟 ${currentStepIndex + 1}/${totalSteps}`;
  document.getElementById('categoryTitle').textContent = category.title;
  
  const progressPercent = ((currentStepIndex + 1) / totalSteps) * 100;
  document.getElementById('progressBar').style.width = `${progressPercent}%`;

  // Update Next Button Text
  const nextBtnText = document.getElementById('nextBtnText');
  if (currentStepIndex === totalSteps - 1) {
    nextBtnText.textContent = '查看診斷結果';
  } else {
    nextBtnText.textContent = '下一步';
  }

  // Update Prev Button State
  document.getElementById('prevBtn').disabled = (currentStepIndex === 0);

  // Render Questions
  const container = document.getElementById('questionsContainer');
  container.innerHTML = '';

  category.questions.forEach((q, idx) => {
    const qCard = document.createElement('div');
    qCard.className = 'bg-slate-800/70 border border-slate-700/60 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-lg space-y-4 animate-fadeIn';
    
    // Question Header
    const qHeader = document.createElement('div');
    qHeader.className = 'flex flex-col space-y-1.5 border-b border-slate-700/40 pb-3';
    
    let subtextHtml = q.subtext ? `<p class="text-xs text-amber-500 dark:text-amber-400 font-medium pl-10">${q.subtext}</p>` : '';

    qHeader.innerHTML = `
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm flex-shrink-0">
          ${idx + 1}
        </div>
        <h4 class="font-bold text-base sm:text-lg text-white">${q.label}</h4>
      </div>
      ${subtextHtml}
    `;
    qCard.appendChild(qHeader);

    // Render Question Controls
    if (q.type === 'single_choice') {
      const optionsGrid = document.createElement('div');
      optionsGrid.className = 'grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1';

      q.options.forEach(opt => {
        const isSelected = (userAnswers[q.id] === opt.value);
        const optBtn = document.createElement('button');
        optBtn.className = `choice-card w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
          isSelected 
            ? 'selected border-emerald-500 bg-emerald-500/10 text-white shadow-md shadow-emerald-500/10' 
            : 'border-slate-700/70 bg-slate-800/50 hover:bg-slate-700/60 text-slate-300'
        }`;
        optBtn.onclick = () => {
          userAnswers[q.id] = opt.value;
          renderStep();
          updateLiveCounter();
        };

        const footprintText = opt.footprint_liters > 0 ? `+${opt.footprint_liters}L` : '0L';
        optBtn.innerHTML = `
          <div class="flex items-center space-x-3">
            <span class="text-2xl">${opt.emoji || '💧'}</span>
            <span class="font-semibold text-sm sm:text-base">${opt.label}</span>
          </div>
          <span class="text-xs px-2.5 py-1 rounded-full font-mono font-semibold ${
            opt.footprint_liters > 500 
              ? 'bg-amber-500/20 text-amber-400 dark:text-amber-300 border border-amber-500/30' 
              : 'bg-slate-700/60 text-slate-400'
          }">${footprintText}</span>
        `;
        optionsGrid.appendChild(optBtn);
      });
      qCard.appendChild(optionsGrid);

    } else if (q.type === 'number_slider') {
      const currentValue = userAnswers[q.id] !== undefined ? userAnswers[q.id] : q.default;
      const currentCalculatedLiters = currentValue * q.multiplier;

      const sliderWrapper = document.createElement('div');
      sliderWrapper.className = 'space-y-4 pt-1';

      sliderWrapper.innerHTML = `
        <div class="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-700/40">
          <div class="flex items-center space-x-2">
            <span class="text-xs text-slate-400">目前選擇：</span>
            <span id="sliderVal_${q.id}" class="text-xl font-extrabold text-emerald-400 font-mono">${currentValue}</span>
            <span class="text-xs text-slate-400">${q.unit}</span>
          </div>
          <div class="flex items-center space-x-1.5 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
            <span class="text-xs text-emerald-400 font-medium">耗水估計：</span>
            <span id="sliderLiters_${q.id}" class="font-bold text-emerald-400 dark:text-emerald-300 font-mono text-sm">+${currentCalculatedLiters} L</span>
          </div>
        </div>

        <div class="px-2">
          <input type="range" id="range_${q.id}" min="${q.min}" max="${q.max}" value="${currentValue}" class="w-full" />
          <div class="flex justify-between text-[11px] text-slate-400 px-1 mt-2">
            <span>${q.min} ${q.unit}</span>
            <span>${Math.round((q.min + q.max) / 2)} ${q.unit}</span>
            <span>${q.max} ${q.unit}</span>
          </div>
        </div>
      `;

      qCard.appendChild(sliderWrapper);

      // Attach event listener after appending
      setTimeout(() => {
        const sliderInput = document.getElementById(`range_${q.id}`);
        if (sliderInput) {
          sliderInput.oninput = (e) => {
            const val = parseInt(e.target.value, 10);
            userAnswers[q.id] = val;
            document.getElementById(`sliderVal_${q.id}`).textContent = val;
            document.getElementById(`sliderLiters_${q.id}`).textContent = `+${val * q.multiplier} L`;
            updateLiveCounter();
          };
        }
      }, 0);

    } else if (q.type === 'multiple_choice') {
      const optionsGrid = document.createElement('div');
      optionsGrid.className = 'grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1';

      const currentSelected = userAnswers[q.id] || [];

      q.options.forEach(opt => {
        const isSelected = currentSelected.includes(opt.value);
        const optBtn = document.createElement('button');
        optBtn.className = `choice-card w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
          isSelected 
            ? 'selected border-emerald-500 bg-emerald-500/10 text-white shadow-md shadow-emerald-500/10' 
            : 'border-slate-700/70 bg-slate-800/50 hover:bg-slate-700/60 text-slate-300'
        }`;

        optBtn.onclick = () => {
          let updated = [...(userAnswers[q.id] || [])];
          if (updated.includes(opt.value)) {
            updated = updated.filter(v => v !== opt.value);
          } else {
            updated.push(opt.value);
          }
          userAnswers[q.id] = updated;
          renderStep();
          updateLiveCounter();
        };

        optBtn.innerHTML = `
          <div class="flex items-center space-x-3">
            <span class="text-2xl">${opt.emoji || '🥤'}</span>
            <span class="font-semibold text-sm sm:text-base">${opt.label}</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-xs px-2.5 py-1 rounded-full font-mono font-semibold bg-slate-700/60 text-slate-400">+${opt.footprint_liters}L</span>
            <div class="w-5 h-5 rounded-md border flex items-center justify-center ${
              isSelected ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-slate-600'
            }">
              ${isSelected ? '<i data-lucide="check" class="w-3.5 h-3.5"></i>' : ''}
            </div>
          </div>
        `;
        optionsGrid.appendChild(optBtn);
      });

      qCard.appendChild(optionsGrid);
    }

    container.appendChild(qCard);
  });

  // Re-initialize Lucide Icons for dynamic content
  lucide.createIcons();
  updateLiveCounter();
}

// Next Step
function nextStep() {
  if (currentStepIndex < APP_DATA.categories.length - 1) {
    currentStepIndex++;
    renderStep();
    window.scrollTo({ top: 100, behavior: 'smooth' });
  } else {
    // Finish Quiz and Display Results
    showResults();
  }
}

// Previous Step
function prevStep() {
  if (currentStepIndex > 0) {
    currentStepIndex--;
    renderStep();
    window.scrollTo({ top: 100, behavior: 'smooth' });
  }
}

// Calculate Total Footprint & Category Breakdowns
function calculateFootprints() {
  let categoryTotals = {
    direct_water: 0,
    diet_water: 0,
    lifestyle_water: 0
  };

  let itemizedList = [];

  APP_DATA.categories.forEach(cat => {
    cat.questions.forEach(q => {
      const val = userAnswers[q.id];

      if (q.type === 'single_choice') {
        const selectedOpt = q.options.find(o => o.value === val);
        if (selectedOpt) {
          const liters = selectedOpt.footprint_liters;
          categoryTotals[cat.id] += liters;
          itemizedList.push({
            questionLabel: q.label,
            answerLabel: selectedOpt.label,
            liters: liters,
            categoryTitle: cat.title,
            emoji: selectedOpt.emoji || '💧'
          });
        }
      } else if (q.type === 'number_slider') {
        const numericVal = parseInt(val || 0, 10);
        const liters = numericVal * q.multiplier;
        categoryTotals[cat.id] += liters;
        itemizedList.push({
          questionLabel: q.label,
          answerLabel: `${numericVal} ${q.unit}`,
          liters: liters,
          categoryTitle: cat.title,
          emoji: q.id.includes('shower') ? '🚿' : '📄'
        });
      } else if (q.type === 'multiple_choice') {
        const selectedArr = Array.isArray(val) ? val : [];
        if (selectedArr.length === 0) {
          itemizedList.push({
            questionLabel: q.label,
            answerLabel: '未選擇飲料 (0L)',
            liters: 0,
            categoryTitle: cat.title,
            emoji: '💧'
          });
        } else {
          selectedArr.forEach(v => {
            const opt = q.options.find(o => o.value === v);
            if (opt) {
              categoryTotals[cat.id] += opt.footprint_liters;
              itemizedList.push({
                questionLabel: q.label,
                answerLabel: opt.label,
                liters: opt.footprint_liters,
                categoryTitle: cat.title,
                emoji: opt.emoji || '🥤'
              });
            }
          });
        }
      }
    });
  });

  const grandTotal = categoryTotals.direct_water + categoryTotals.diet_water + categoryTotals.lifestyle_water;
  return { categoryTotals, grandTotal, itemizedList };
}

// Live Counter Update
function updateLiveCounter() {
  const { grandTotal } = calculateFootprints();
  const counterEl = document.getElementById('liveCounter');
  if (counterEl) {
    counterEl.textContent = grandTotal.toLocaleString();
  }
}

// Show Results Screen
function showResults() {
  const { categoryTotals, grandTotal, itemizedList } = calculateFootprints();

  document.getElementById('quizScreen').classList.add('hidden');
  document.getElementById('resultScreen').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Determine Badge Tier
  let matchedTier = APP_DATA.result_tiers[1]; // default middle
  for (const tier of APP_DATA.result_tiers) {
    if (grandTotal >= tier.min && grandTotal <= tier.max) {
      matchedTier = tier;
      break;
    }
  }

  // Set Total Liters Animation
  document.getElementById('resultTotalLiters').textContent = grandTotal.toLocaleString();

  // Set Badge & Summary
  document.getElementById('resultBadge').textContent = matchedTier.badge.split(' ')[0];
  document.getElementById('resultBadgeIcon').textContent = matchedTier.badge.split(' ')[1] || '🌊';
  document.getElementById('resultSummary').textContent = matchedTier.summary;
  document.getElementById('resultTip').textContent = `💡 省水建議：${matchedTier.tip}`;

  // Set Equivalents
  const bottles = Math.round(grandTotal / 0.6);
  const tubs = (grandTotal / 180).toFixed(1);
  document.getElementById('bottlesCount').textContent = `${bottles.toLocaleString()} 瓶`;
  document.getElementById('tubsCount').textContent = `${tubs} 缸`;

  // Render Charts
  renderCharts(categoryTotals, grandTotal);

  // Render Itemized Breakdown List
  renderBreakdownList(itemizedList, grandTotal);

  // Render Action Tips
  renderActionTips();

  // Trigger Confetti Celebration for low footprint or complete
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#10b981', '#0ea5e9', '#3b82f6', '#f59e0b']
  });
}

// Render Charts via Chart.js
function renderCharts(categoryTotals, grandTotal) {
  const isLight = document.documentElement.classList.contains('light');
  const textColor = isLight ? '#334155' : '#e2e8f0';
  const gridColor = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)';

  // Chart 1: Doughnut Chart (Category Breakdown)
  const ctxCategory = document.getElementById('categoryChart').getContext('2d');
  if (categoryChartInstance) categoryChartInstance.destroy();

  categoryChartInstance = new Chart(ctxCategory, {
    type: 'doughnut',
    data: {
      labels: ['衛浴清潔 (直接水)', '飲食飲料 (飲食虛擬水)', '學習消費 (消費虛擬水)'],
      datasets: [{
        data: [categoryTotals.direct_water, categoryTotals.diet_water, categoryTotals.lifestyle_water],
        backgroundColor: ['#10b981', '#0ea5e9', '#8b5cf6'],
        borderWidth: 0,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      cutout: '70%'
    }
  });

  // Render Custom Doughnut Legend
  const legendContainer = document.getElementById('chartLegend');
  legendContainer.innerHTML = `
    <div class="bg-slate-900/60 p-2 rounded-xl border border-slate-700/40">
      <div class="flex items-center justify-center space-x-1 mb-1">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
        <span class="text-slate-300 font-medium">直接衛浴</span>
      </div>
      <div class="font-bold font-mono text-emerald-400">${categoryTotals.direct_water}L</div>
    </div>
    <div class="bg-slate-900/60 p-2 rounded-xl border border-slate-700/40">
      <div class="flex items-center justify-center space-x-1 mb-1">
        <span class="w-2.5 h-2.5 rounded-full bg-ocean-500"></span>
        <span class="text-slate-300 font-medium">飲食虛擬水</span>
      </div>
      <div class="font-bold font-mono text-ocean-400">${categoryTotals.diet_water}L</div>
    </div>
    <div class="bg-slate-900/60 p-2 rounded-xl border border-slate-700/40">
      <div class="flex items-center justify-center space-x-1 mb-1">
        <span class="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
        <span class="text-slate-300 font-medium">消費虛擬水</span>
      </div>
      <div class="font-bold font-mono text-purple-400">${categoryTotals.lifestyle_water}L</div>
    </div>
  `;

  // Chart 2: Horizontal Bar Comparison Chart
  const ctxComparison = document.getElementById('comparisonChart').getContext('2d');
  if (comparisonChartInstance) comparisonChartInstance.destroy();

  comparisonChartInstance = new Chart(ctxComparison, {
    type: 'bar',
    data: {
      labels: ['你的水足跡', '臺灣高中生平均', '理想目標值'],
      datasets: [{
        label: '每日水足跡 (公升)',
        data: [grandTotal, 2200, 1500],
        backgroundColor: [
          grandTotal <= 1500 ? '#10b981' : (grandTotal <= 2500 ? '#0ea5e9' : '#ef4444'),
          '#64748b',
          '#10b981'
        ],
        borderRadius: 8,
        barThickness: 24
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { color: textColor }
        },
        y: {
          grid: { display: false },
          ticks: { color: textColor, font: { weight: 'bold' } }
        }
      }
    }
  });
}

// Render Itemized Breakdown
function renderBreakdownList(itemizedList, grandTotal) {
  const container = document.getElementById('breakdownList');
  container.innerHTML = '';

  // Sort by liters descending to highlight biggest impact items
  const sorted = [...itemizedList].sort((a, b) => b.liters - a.liters);

  sorted.forEach(item => {
    const percent = grandTotal > 0 ? Math.round((item.liters / grandTotal) * 100) : 0;
    const row = document.createElement('div');
    row.className = 'bg-slate-900/60 p-3.5 rounded-2xl border border-slate-700/50 flex items-center justify-between space-x-3';

    row.innerHTML = `
      <div class="flex items-center space-x-3 min-w-0">
        <span class="text-2xl flex-shrink-0">${item.emoji}</span>
        <div class="truncate">
          <div class="text-xs text-slate-400 truncate">${item.questionLabel}</div>
          <div class="font-semibold text-sm text-white truncate">${item.answerLabel}</div>
        </div>
      </div>
      <div class="text-right flex-shrink-0">
        <div class="font-mono font-bold text-emerald-400 text-sm">+${item.liters} L</div>
        <div class="text-[10px] text-slate-400">占比 ${percent}%</div>
      </div>
    `;

    container.appendChild(row);
  });
}

// Render Customized Water Saving Action Plan Tips
function renderActionTips() {
  const container = document.getElementById('actionTipsList');
  container.innerHTML = '';

  const tips = [];

  // Check choices and add smart recommendations
  if (userAnswers['lunch_meal'] === 'beef_bento') {
    tips.push({
      icon: '🥩',
      title: '替換牛肉主餐',
      desc: '1 公斤牛肉水足跡高達 15,400L！改吃雞排便當或蔬食，一天就能輕鬆省下 1,100~1,750 公升虛擬水！'
    });
  }

  const drinks = userAnswers['daily_drinks'] || [];
  if (drinks.includes('boba_tea') || drinks.includes('milk_tea')) {
    tips.push({
      icon: '🍵',
      title: '手搖飲聰明選',
      desc: '鮮奶茶與珍奶因為含乳量與配料製作，水足跡高達 450~500L！嘗試換成無糖純茶，一口氣省下 300L 水！'
    });
  }

  if (userAnswers['shower_type'] === 'bath') {
    tips.push({
      icon: '🚿',
      title: '改為淋浴替代泡澡',
      desc: '泡澡一次消耗約 180 公升水！改為 10 分鐘淋浴，可直接省下過半的直接用水！'
    });
  } else if ((userAnswers['shower_duration'] || 15) > 15) {
    tips.push({
      icon: '⏱️',
      title: '淋浴時間縮短 3~5 分鐘',
      desc: '每減少 1 分鐘淋浴就能節省 10 公升水！播放一首 4 分鐘的流行歌當作洗澡計時器吧！'
    });
  }

  if (userAnswers['teeth_brushing'] === 'running_water') {
    tips.push({
      icon: '🥤',
      title: '使用漱口杯刷牙',
      desc: '刷牙時水龍頭持續開著會流掉 12 公升水，使用漱口杯只需 1 公升，簡單一步省水 90%！'
    });
  }

  if (userAnswers['paper_sheets'] > 15) {
    tips.push({
      icon: '📱',
      title: '善用數位筆記與雙面列印',
      desc: '製造 1 張 A4 紙需要 10 公升虛擬水！多使用雙面筆記或 iPad 講義，減少考卷紙張浪費！'
    });
  }

  // Fallback tip if already super eco-friendly
  if (tips.length === 0) {
    tips.push({
      icon: '🌟',
      title: '擔任班級永續省水大使',
      desc: '你的生活習慣非常優秀！邀請同學一起測驗水足跡，推廣校園節水行動吧！'
    });
  }

  tips.forEach(t => {
    const card = document.createElement('div');
    card.className = 'bg-slate-900/70 p-3.5 rounded-2xl border border-slate-700/60 space-y-1';
    card.innerHTML = `
      <div class="font-bold text-emerald-400 flex items-center space-x-1.5">
        <span>${t.icon}</span>
        <span>${t.title}</span>
      </div>
      <p class="text-slate-300 text-xs leading-relaxed font-light">${t.desc}</p>
    `;
    container.appendChild(card);
  });
}

// Download/Export Certificate Card as Image
function downloadCertificate() {
  const cardElement = document.getElementById('certificateCard');
  const isLight = document.documentElement.classList.contains('light');

  html2canvas(cardElement, {
    scale: 2,
    backgroundColor: isLight ? '#ffffff' : '#0f172a',
    useCORS: true
  }).then(canvas => {
    const image = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.download = `臺灣高中生水足跡診斷證書.png`;
    link.href = image;
    link.click();
  }).catch(err => {
    console.error('Error generating image:', err);
    alert('下載圖片時發生錯誤，您可以使用螢幕截圖分享診斷結果！');
  });
}

// Reset App to Welcome
function resetApp() {
  currentStepIndex = 0;
  initDefaultAnswers();
  document.getElementById('resultScreen').classList.add('hidden');
  document.getElementById('quizScreen').classList.add('hidden');
  document.getElementById('welcomeScreen').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Info Modal Toggle
function toggleInfoModal() {
  const modal = document.getElementById('infoModal');
  if (modal.classList.contains('hidden')) {
    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.classList.remove('opacity-0');
    }, 10);
  } else {
    modal.classList.add('opacity-0');
    setTimeout(() => {
      modal.classList.add('hidden');
    }, 300);
  }
}

// Toggle Dark / Light Theme
function toggleTheme() {
  const html = document.documentElement;
  const isLight = html.classList.toggle('light');
  
  const sunIcon = document.getElementById('themeIconSun');
  const moonIcon = document.getElementById('themeIconMoon');

  if (isLight) {
    sunIcon.classList.remove('hidden');
    moonIcon.classList.add('hidden');
  } else {
    sunIcon.classList.add('hidden');
    moonIcon.classList.remove('hidden');
  }

  // Re-render chart text colors if results screen is visible
  if (!document.getElementById('resultScreen').classList.contains('hidden')) {
    const { categoryTotals, grandTotal } = calculateFootprints();
    renderCharts(categoryTotals, grandTotal);
  }
}

// Document Ready Initialization
document.addEventListener('DOMContentLoaded', () => {
  initDefaultAnswers();
  lucide.createIcons();
});
