function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    let flag = true;
    let result;
    // функция, считает кл-во открытых и закрытых скобок
    function countBrackets(expr) {
      let openBracket = 0;
      let closeBracket = 0;
      for (let i = 0; i < expr.length; i++) {
        if (expr[i] == "(") {
          openBracket++;
        }
        if (expr[i] == ")") {
          closeBracket++;
        }
      }
      if (openBracket !== closeBracket) {
        throw new Error("ExpressionError: Brackets must be paired");
      }
    }
    // функция,  которая вычисляет выражения без скобок
    function evaluateExpressions(string) {
      let evaluetedNum;
      let ExpressionsArr = [];
      string = string.trim();
  
        // строку разделить и положить в массив
        let arr = string.split("");
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] == " ") {
            arr.splice(i, 1);
            i--;
          }
        }
        let arr2 = [];
        string = arr.join("");
        let temp = "";
        for (let i = 0; i < string.length; i++) {
          if (string[i] == ".") {
            temp += string[i];
            continue;
          }
          if (isNaN(string[i]) && isNaN(string[i - 1])) {
            temp += string[i];
            continue;
          }
          if (isNaN(string[i])) {
            if (temp.length > 0) {
              ExpressionsArr.push(temp);
              temp = "";
            }
            ExpressionsArr.push(string[i]);
            continue;
          }
          temp += string[i];
        }
        ExpressionsArr.push(temp);
      
      // бегаем по массиву и выполняем все * и /
      for (let i = 0; i <= ExpressionsArr.length; i++) {
        if (ExpressionsArr[i] == "*" && i !== 0) {
          evaluetedNum = ExpressionsArr[i - 1] * ExpressionsArr[i + 1];
          evaluetedNum += "";
          ExpressionsArr.splice(i - 1, 3, evaluetedNum);
          if (
            ExpressionsArr.indexOf("/") !== -1 ||
            ExpressionsArr.indexOf("*") !== -1
          ) {
            i--;
          }
        }
        if (ExpressionsArr[i] == "/" && i !== 0) {
          if(ExpressionsArr[i + 1] == '0'){
            throw new Error("TypeError: Division by zero.")
            
          }
          evaluetedNum = ExpressionsArr[i - 1] / ExpressionsArr[i + 1];
          evaluetedNum += "";
          ExpressionsArr.splice(i - 1, 3, evaluetedNum);
          if (
            ExpressionsArr.indexOf("/") !== -1 ||
            ExpressionsArr.indexOf("*") !== -1
          ) {
            i--;
          }
        }
      }
  
      // бегаем по массиву и выполняем все + и -
      for (let i = 0; i <= ExpressionsArr.length; i++) {
        if (i !== 0 && ExpressionsArr[i] == "+") {
          evaluetedNum =
            Number(ExpressionsArr[i - 1]) + Number(ExpressionsArr[i + 1]);
          evaluetedNum += "";
          ExpressionsArr.splice(i - 1, 3, evaluetedNum);
          if (
            ExpressionsArr.indexOf("+") !== -1 ||
            ExpressionsArr.indexOf("-") !== -1
          ) {
            i--;
          }
        }
        if (i !== 0 && ExpressionsArr[i] == "-") {
          evaluetedNum =
            Number(ExpressionsArr[i - 1]) - Number(ExpressionsArr[i + 1]);
          evaluetedNum += "";
          ExpressionsArr.splice(i - 1, 3, evaluetedNum);
          if (
            ExpressionsArr.indexOf("+") !== -1 ||
            ExpressionsArr.indexOf("-") !== -1
          ) {
            i--;
          }
        }
      }
        // проверяет, если выражение выпало без скобок, то просто возвращаем,  если со скобками и надо вернуть на место, то прибавляем в конец закрывающую скобку
      ExpressionsArr = ExpressionsArr.join(" ");
      if (!flag) {
        return ExpressionsArr;
      }
      let a = " " + ExpressionsArr + " )";
      return a;
    }
    // находим самые вложенные скобки
    function findNestedBrackets(expr) {
      let calculatedString = "";
      let checkfirstIndex = 0;
      let checklastIndex = 0;
    // режем массив по открывающим скобкам
      expr = expr.split("(");
        // берем первый закрывающий, он же и самый вложенный
      for (let i = 0; i < expr.length; i++) {
        let a = expr[i].indexOf(")");
        if (a !== -1) {
          checkfirstIndex = i;
          checklastIndex = a;
          calculatedString = expr[checkfirstIndex].slice(0, checklastIndex); //вырезали нужную часть строки
          let templeteArr = expr[checkfirstIndex].split(""); //разделили в массив
          templeteArr.splice(
            0,
            checklastIndex + 1,
            evaluateExpressions(calculatedString)
          ); //вырезали нужную часть, вызвали функцию и посчитали эту часть и вернули в массив
          templeteArr = templeteArr.join(""); // склеили эту часть
          expr[checkfirstIndex] = templeteArr;
        }
      }
  
      // приводим в нормальный вид выражение с вычисленными скобками - здесь скобки убираем,  оставляем только вычисленное число
      expr = expr.join("(");
      let arrForDeleteBrackets = expr.split(" ");
      for (let i = 0; i < arrForDeleteBrackets.length; i++) {
        if (
          arrForDeleteBrackets[i - 1] == "(" &&
          typeof +arrForDeleteBrackets[i] == "number" &&
          arrForDeleteBrackets[i + 1] == ")"
        ) {
          arrForDeleteBrackets.splice(i + 1, 1);
          arrForDeleteBrackets.splice(i - 1, 1);
          i = i - 2;
        }
      }
      expr = arrForDeleteBrackets.join(" ");
  
      // если есть еще скобки,  рекурсивно вызываем функцию, если нет то вызываем функцию, которая вычислит последнее выражение и выйдет из стека
      if (expr.indexOf(")") !== -1) {
        return findNestedBrackets(expr);
      } else {
        flag = false;
        return evaluateExpressions(expr);
      }
    }
  
    // считаем кл-во скобок
    countBrackets(expr);
    // смотрим если есть скобки,  то вызываем функцию парсера скобок,  если нет напрямую калькулятор вычисления без скобок
    if (expr.indexOf("(") !== -1) {
      result = findNestedBrackets(expr);
    } else {
      flag = false;
      result = evaluateExpressions(expr);
    }
    return +result;
  }
  
module.exports = {
    expressionCalculator
}