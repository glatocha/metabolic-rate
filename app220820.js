const bmr_form = document.getElementById("bmr_form");
const bmr_weight = document.getElementById("input_weight");
const bmr_height = document.getElementById("input_height");
const bmr_age = document.getElementById("input_age");
const bmr_output = document.getElementById("bmr_output");
const bmr_formula = document.getElementById("bmr_formula");
const bmr_sex = document.getElementById("bmr_sex");
const tmr_factor = document.getElementById("tmr_factor");
const tmr_output = document.getElementById("tmr_output");
const bmr_sex_sel = document.getElementById("bmr_sex_sel");

const lang_sel = document.getElementById("nav_lang");
const nav_unit = document.getElementById("nav_unit");

const cal_breakfast = document.getElementById("cal_breakfast");
const cal_snack1 = document.getElementById("cal_snack1");
const cal_lunch = document.getElementById("cal_lunch");
const cal_snack2 = document.getElementById("cal_snack2");
const cal_dinner = document.getElementById("cal_dinner");

loadState();

function calculateBMR(sex, weight, height, age, formula) {
  var BMR;
  if (sex === "male") {
    switch (formula) {
      case "HBEq":
        BMR = weight * 13.7516 + height * 5.033 - age * 6.755 + 66.473;
        break;
      case "revHBEq":
        BMR = weight * 13.397 + height * 4.799 - age * 5.677 + 88.362;
        break;
      case "MSJEq":
        BMR = weight * 10.0 + height * 6.25 - age * 5.0 + 5.0;
        break;
    }
  } else {
    switch (formula) {
      case "HBEq":
        BMR = weight * 9.5634 + height * 1.8496 - age * 4.6756 + 655.0955;
        break;
      case "revHBEq":
        BMR = weight * 9.247 + height * 3.098 - age * 4.33 + 447.593;
        break;
      case "MSJEq":
        BMR = weight * 10.0 + height * 6.25 - age * 5.0 - 161.0;
        break;
    }
  }
  return BMR;
}

function calculateTMR(BMR, factor) {
  return BMR * factor;
}

bmr_sex_sel.addEventListener("change", () => {
  if (bmr_sex_sel.checked) {
    document.getElementById("sex_icon_male").classList.remove("icon-selected");
    document.getElementById("sex_icon_female").classList.add("icon-selected");
  } else {
    document.getElementById("sex_icon_male").classList.add("icon-selected");
    document
      .getElementById("sex_icon_female")
      .classList.remove("icon-selected");
  }
});

bmr_form.addEventListener("change", recalculate);
nav_unit.addEventListener("change", () => {
  if (nav_unit.checked) {
    document.getElementById("weight_unit").innerText = "lbs";
    document.getElementById("height_unit").innerText = "in";
    bmr_weight.value = (bmr_weight.value / 0.453592).toFixed(0);
    bmr_height.value = (bmr_height.value / 2.54).toFixed(0);
  } else {
    document.getElementById("weight_unit").innerText = "kg";
    document.getElementById("height_unit").innerText = "cm";
    bmr_weight.value = (bmr_weight.value * 0.453592).toFixed(0);
    bmr_height.value = (bmr_height.value * 2.54).toFixed(0);
  }

  setTimeout(recalculate, 50);
});

function recalculate() {
  var sex = bmr_sex_sel.checked ? "female" : "male";
  console.log("sex :>> ", sex);
  var weight = bmr_weight.value;
  var height = bmr_height.value;
  var age = bmr_age.value;
  var formula = bmr_formula.value;
  var factor = parseFloat(tmr_factor.value);

  //convert units from US to SI if selected
  if (nav_unit.checked) {
    console.log("using US units");
    weight = weight * 0.453592; //lbs to kg
    height = height * 2.54; //in to cm
    console.log("weight :>> ", weight);
    console.log("height :>> ", height);
  }

  var BMR = calculateBMR(sex, weight, height, age, formula);
  var TMR = calculateTMR(BMR, factor);

  bmr_output.value = BMR.toFixed(0);
  tmr_output.value = TMR.toFixed(0);

  var meals = calcMeals(TMR);

  cal_breakfast.innerText = meals.breakfast;
  cal_snack1.innerText = meals.snack1;
  cal_lunch.innerText = meals.lunch;
  cal_snack2.innerText = meals.snack2;
  cal_dinner.innerText = meals.dinner;

  storeState();
}

function storeState() {
  const state = {
    lang_sel: lang_sel.checked,
    nav_unit: nav_unit.checked,
    bmr_sex_sel: bmr_sex_sel.checked,
    bmr_formula: bmr_formula.value,
    weight: bmr_weight.value,
    height: bmr_height.value,
    age: bmr_age.value,
    tmr_factor: tmr_factor.value,
  };
  localStorage.setItem("BMRstate", JSON.stringify(state));
  console.log("state saved");
}

function loadState() {
  if (localStorage.getItem("BMRstate") !== null) {
    const state = JSON.parse(localStorage.getItem("BMRstate"));
    console.log("state :>> ", state);
    lang_sel.checked = state.lang_sel;
    nav_unit.checked = state.nav_unit;
    bmr_sex_sel.checked = state.bmr_sex_sel;
    bmr_formula.value = state.bmr_formula;
    bmr_weight.value = state.weight;
    bmr_height.value = state.height;
    bmr_age.value = state.age;
    tmr_factor.value = state.tmr_factor;

    if (state.bmr_sex_sel) {
      document
        .getElementById("sex_icon_male")
        .classList.remove("icon-selected");
      document.getElementById("sex_icon_female").classList.add("icon-selected");
    } else {
      document.getElementById("sex_icon_male").classList.add("icon-selected");
      document
        .getElementById("sex_icon_female")
        .classList.remove("icon-selected");
    }

    changeLanguage(state.lang_sel ? "PL" : "EN");
    var BMR = calculateBMR(
      state.bmr_sex_sel ? "female" : "male",
      state.weight,
      state.height,
      state.age,
      state.bmr_formula
    );
    var TMR = calculateTMR(BMR, state.tmr_factor);

    bmr_output.value = BMR.toFixed(0);
    tmr_output.value = TMR.toFixed(0);

    var meals = calcMeals(TMR);

    cal_breakfast.innerText = meals.breakfast;
    cal_snack1.innerText = meals.snack1;
    cal_lunch.innerText = meals.lunch;
    cal_snack2.innerText = meals.snack2;
    cal_dinner.innerText = meals.dinner;
  }
}

lang_sel.addEventListener("change", (e) => {
  changeLanguage(e.target.checked ? "PL" : "EN");
  storeState();
});

function changeLanguage(lang) {
  console.log("change lang :>> ", lang);

  for (const key in texts) {
    console.log(`${key}: ${texts[key][lang]}`);
    document.getElementById(key).innerText = texts[key][lang];
  }

  document.title = texts.nav_title[lang];
}

function calcMeals(tmr) {
  return {
    breakfast: (tmr * 0.25).toFixed(0),
    snack1: (tmr * 0.1).toFixed(0),
    lunch: (tmr * 0.35).toFixed(0),
    snack2: (tmr * 0.1).toFixed(0),
    dinner: (tmr * 0.2).toFixed(0),
  };
}
