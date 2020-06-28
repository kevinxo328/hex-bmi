const cal = document.querySelector('.js-btn');
const result = document.querySelector('.l-records__result');
let data = JSON.parse(localStorage.getItem('record')) || [];

// 監聽
cal.addEventListener('click', bmiCalculator);

function bmiCalculator() {
   const h = document.getElementById('height').value;
   const w = document.getElementById('weight').value;
   const bmi = (w / (h / 100 * h / 100)).toFixed(2);

   setData(h, w, bmi);
   updateList(data);
}

// 儲存資料到localstorage
function setData(height, weight, bmi) {
   const date = new Date();
   const year = date.getFullYear();
   const month = date.getMonth() + 1;
   const day = date.getDate();
   const today = month + '-' + day + '-' + year;
   let result = {
      'bmi': bmi,
      'height': height,
      'weight': weight,
      'date': today
   }

   switch (true) {
      case (bmi < 18.5):
         result.status = '體重過輕';
         result.color = 'blue';
         break;
      case (18.5 <= bmi && bmi < 24):
         result.status = '正常';
         result.color = 'green';
         break;
      case (24 <= bmi && bmi < 27):
         result.status = '過重';
         result.color = 'orange';
         break;
      case (27 <= bmi && bmi < 30):
         result.status = '輕度肥胖';
         result.color = 'redish';
         break;
      case (30 <= bmi && bmi < 35):
         result.status = '中度肥胖';
         result.color = 'redish';
         break;
      case (35 < bmi):
         result.status = '重度肥胖';
         result.color = 'red';
         break;
   }
   setBtn(result);
   data.push(result);
   // console.log(data);
   localStorage.setItem('records', JSON.stringify(data));
}

function updateList(data) {
   let str = '';

   for (let i = 0; i < data.length; i++) {
      str +=
         `<div class="c-result">
            <div class="c-result__mark c-result__mark--${data[i].color}"></div>
            <div class="c-result__status">${data[i].status}</div>
            <div class="c-result__bmi"><span class="c-result__bmi--small">BMI</span>${data[i].bmi}</div>
            <div class="c-result__weight"><span class="c-result__weight--small">weight</span>${data[i].weight}</div>
            <div class="c-result__height"><span class="c-result__height--small">height</span>${data[i].height}</div>
            <div class="c-result__date">${data[i].date}</div>
         </div>`
   };

   result.innerHTML = str;
}

function setBtn(result) {
   const str =
      `<button class="c-resultBtn c-resultBtn--${result.color}">
         <div class="c-resultBtn__bmi ">${result.bmi} <span>bmi</span></div>
         <div class="c-resultBtn__loop c-resultBtn__loop--${result.color}">
            <img src="./img/icons_loop.png" alt="">
         </div>
      </button>
      <div class="c-resultBtn__status c-resultBtn__status--${result.color}">${result.status}</div>`
   cal.innerHTML = str;
}