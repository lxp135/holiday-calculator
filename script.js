// 节假日配置
const holidays = [
    { name: '元旦', date: '2025-01-01', icon: '🎊' },
    { name: '春节', date: '2025-01-28', icon: '🧧' },
    { name: '清明节', date: '2025-04-04', icon: '🌸' },
    { name: '劳动节', date: '2025-05-01', icon: '⚒️' },
    { name: '端午节', date: '2025-05-31', icon: '🥟' },
    { name: '中秋节', date: '2025-10-06', icon: '🥮' },
    { name: '国庆节', date: '2025-10-01', icon: '🇨🇳' }
];

// 特殊日期配置
const specialDates = [
    { name: '退休', date: '2049-09-01', icon: '🏖️', type: 'retirement' }
];

// 获取下一个周末
function getNextWeekend() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
    let daysUntilWeekend;
    
    if (dayOfWeek === 0 || dayOfWeek === 6) { // 今天是周六或者周日
        daysUntilWeekend = 0;
    } else {
        daysUntilWeekend = 6 - dayOfWeek; // 到本周六的天数
    }
    
    const nextWeekend = new Date(today);
    nextWeekend.setDate(today.getDate() + daysUntilWeekend);
    
    return {
        name: '周末',
        date: nextWeekend,
        icon: '🎉',
        type: 'weekend'
    };
}

// 获取下一个发工资日（每月10号）
function getNextSalaryDay() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const currentDay = today.getDate();
    
    let nextSalaryDate;
    
    if (currentDay <= 10) {
        // 如果今天是10号之前，下次发工资就是本月10号
        nextSalaryDate = new Date(currentYear, currentMonth, 10);
    } else {
        // 如果今天是10号之后，下次发工资就是下月10号
        nextSalaryDate = new Date(currentYear, currentMonth + 1, 10);
    }

    console.log(nextSalaryDate);
    
    return {
        name: '发工资',
        date: nextSalaryDate,
        icon: '💰',
        type: 'salary'
    };
}

// 计算两个日期之间的天数差
function calculateDaysDifference(targetDate) {
    const today = new Date();
    const target = new Date(targetDate);
    
    // 重置时间为午夜，只比较日期
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
}

// 格式化日期显示
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    return `${year}年${month}月${day}日`;
}

// 获取当前日期和时间
function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekday = weekdays[now.getDay()];
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    return `${year}年${month}月${day}日 ${weekday} ${hours}:${minutes}`;
}

// 创建倒计时卡片
function createCountdownCard(item) {
    const days = calculateDaysDifference(item.date);
    const card = document.createElement('div');
    card.className = `countdown-card ${item.type || 'holiday'}`;
    
    let daysText;
    if (days === 0) {
        daysText = '今天';
    } else if (days === 1) {
        daysText = '明天';
    } else if (days < 0) {
        daysText = `已过去${Math.abs(days)}天`;
    } else {
        daysText = `还有${days}天`;
    }
    
    card.innerHTML = `
        <span class="card-icon">${item.icon}</span>
        <h3 class="card-title">${item.name}</h3>
        <div class="countdown-days">${daysText}</div>
        <div class="countdown-label">${days > 0 ? '' : days === 0 ? '' : ''}</div>
        <div class="countdown-date">${formatDate(item.date)}</div>
    `;
    
    // 添加动画延迟
    const index = document.querySelectorAll('.countdown-card').length;
    card.style.animationDelay = `${index * 0.1}s`;
    
    return card;
}

// 获取所有需要显示的日期
function getAllDates() {
    const today = new Date();
    const currentYear = today.getFullYear();
    
    // 过滤出当前年份及以后的节假日
    const upcomingHolidays = holidays.filter(holiday => {
        const holidayDate = new Date(holiday.date);
        return holidayDate.getFullYear() >= currentYear;
    });
    
    // 如果当前年份的节假日已经过完，添加下一年的节假日
    const thisYearHolidays = upcomingHolidays.filter(holiday => {
        const holidayDate = new Date(holiday.date);
        return holidayDate.getFullYear() === currentYear && holidayDate >= today;
    });
    
    if (thisYearHolidays.length === 0) {
        // 添加下一年的节假日
        const nextYearHolidays = holidays.map(holiday => ({
            ...holiday,
            date: holiday.date.replace(currentYear.toString(), (currentYear + 1).toString())
        }));
        upcomingHolidays.push(...nextYearHolidays);
    }
    
    // 合并所有日期
    const allDates = [
        getNextWeekend(),
        getNextSalaryDay(),
        ...upcomingHolidays,
        ...specialDates
    ];
    
    // 按日期排序
    return allDates.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        const daysA = calculateDaysDifference(a.date);
        const daysB = calculateDaysDifference(b.date);
        
        // 优先显示即将到来的日期
        if (daysA >= 0 && daysB >= 0) {
            return daysA - daysB;
        } else if (daysA >= 0 && daysB < 0) {
            return -1;
        } else if (daysA < 0 && daysB >= 0) {
            return 1;
        } else {
            return daysB - daysA; // 已过去的日期按时间倒序
        }
    });
}

// 初始化页面
function init() {
    // 更新当前日期时间
    const currentDateElement = document.getElementById('currentDate');
    currentDateElement.textContent = getCurrentDateTime();
    
    // 生成倒计时卡片
    const countdownGrid = document.getElementById('countdownGrid');
    const allDates = getAllDates();
    
    allDates.forEach(item => {
        const card = createCountdownCard(item);
        countdownGrid.appendChild(card);
    });
}

// 更新时间
function updateTime() {
    const currentDateElement = document.getElementById('currentDate');
    currentDateElement.textContent = getCurrentDateTime();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);

// 每分钟更新一次时间
setInterval(updateTime, 60000);

// 每天更新一次倒计时（在午夜后更新）
setInterval(() => {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
        location.reload();
    }
}, 60000);

