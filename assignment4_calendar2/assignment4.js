var currentDateString = new Date();
var currentDay = currentDateString.getDay();
var currentDate = currentDateString.getDate();
var currentMonth = currentDateString.getMonth();
var currentYear = currentDateString.getFullYear();
var currentDateToHighlight = currentDate;
var currentMonthToHighlight = currentMonth;
var currentYearToHighlight = currentYear;
var monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var dayArray = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

//not keeping json object for birthdates since looping will be required on the inner objects to find and compare date . so keeping 2 arrays
// and will match accordingly. will compare 2 date strings

var employees = ["Shubham Katariya", "Shikha Shakarwar", "Vipin Joshi", "Gurpreet Chhabra", "Sonam Ravi Gupta", "Siyaram Patidar", "Shubham Choubey",
                "Mayur Vaidya", "Amit Nagar", "Deepak Patidar", "Diksha Porwal", "Rahul Kulmi", "Vishal Patidar", "Awanish Tiwari", "Nayanpriya Namdeo", "Surendra Patidar",
                "Anjana Singh", "Aaditya Paliwal", "Varsha Tyagi", "Rashmi Soni", "Priyanshi Asawara", "Shashank Saxena", "Nitesh Thakur","Satya Narayan Patidar"
                ];

var birthdayDates = ["Jan 03 1995", "Jan 15 1994", "Jan 15 1946", "Apr 02 1995", "Apr 22 1987", "May 03 1985", "May 08 1993", "May 09 1995", "May 10 1986",
                    "May 10 1990", "May 19 1995", "May 28 1988", "Jun 20 1994", "Jul 06 1974", "Jul 09 1992", "Jul 21 1988", "Jul 24 1992", "Aug 08 1994", "Oct 13 1992",
                    "Oct 19 1993", "Nov 19 1993", "Dec 11 1990", "Dec 12 1990", "Dec 12 1983"
                    ];

 //will make date objects from these date strings and then compare date and month


document.addEventListener("DOMContentLoaded", function(){
  setCalendar();
});

function setCalendar()
{
  document.getElementById("month").innerHTML = monthArray[currentMonth];
  document.getElementById("year").innerHTML = currentYear;
  var topRowDiv = document.createElement("div");
  topRowDiv.className = "top-row-div";
  topRowDiv.setAttribute("id","top-row-div");
  document.getElementById("inner-container-3").appendChild(topRowDiv);

  for(var i = 0; i < 7; i++)
  {
    var topRowColDiv = document.createElement("div");
    topRowColDiv.className = "top-row-col-div";
    topRowColDiv.innerHTML = (dayArray[i]).substr(0,3);
    document.getElementById("top-row-div").appendChild(topRowColDiv);
  } // setting of week day names ends here

  var bottomRowParentDiv = document.createElement("div");
  bottomRowParentDiv.className = "bottom-row-parent-div";
  bottomRowParentDiv.setAttribute("id","bottom-row-parent-div");
  document.getElementById("inner-container-3").appendChild(bottomRowParentDiv);

  var dateObject = new Date(currentYear , currentMonth , 1);
  var dayCode = dateObject.getDay(); // getting day for current months 1 date
  var x = new Date(currentYear, currentMonth+1 , 0);
  var lastDateOfMonth = x.getDate();  // getting last date for current month
  var printInitialDays = true;
  var breakInfiniteLoop = false;
  var currentDateNumber = 1;

  while (true) // creating dynamic rows
  {
    var bottomRowDiv = document.createElement("div");
    bottomRowDiv.className = "bottom-row-div";
    if (dayCode == 0) printInitialDays = false; // if date 1 is on sunday(dayCode = 0) , initial days should not be printed
    var i = 0; // variable for looping on week days i.e 7 days of the week
    var j = 1; // variable for calculation purpose
    for (i = 0; i <= 6; i++)
    {
      if (printInitialDays == true)
      {
        if (i < dayCode) // till the day on which date 1 comes
        {
          var y = new Date(currentYear, currentMonth, 0); //printing dates of last month
          var lastDateOfPreviousMonth = y.getDate();
          var subDiv = document.createElement("div");
          subDiv.className = "sub-div";
          subDiv.classList.add("disabled-dates");
          subDiv.innerHTML = (lastDateOfPreviousMonth-dayCode+j);
          bottomRowDiv.appendChild(subDiv);
          j++;
          if (i == (dayCode-1)) printInitialDays = false; // stop printing before reaching the current day for date 1
        }
      }
      else // printing dates starting from date 1
      {
        var subDiv = document.createElement("div");
        subDiv.className = "sub-div";
        subDiv.innerHTML = currentDateNumber;
        var currentDateBirthdayPeople = [];
        var birthdayString = "";

        if(currentDateNumber == currentDateToHighlight && currentMonth == currentMonthToHighlight && currentYear == currentYearToHighlight)
        {
          subDiv.classList.add("highlight-current-date");
        }

        for(var f = 0; f < birthdayDates.length ; f++) //logic for birtdates start
        {
          var birthdate = new Date(birthdayDates[f]);
          if(birthdate.getDate() == currentDateNumber && birthdate.getMonth() == currentMonth)
          {
            currentDateBirthdayPeople.push(employees[f]);
          }
        }

        if(currentDateBirthdayPeople.length > 0)
        {
          birthdayString = "Birthday of : ";
          for(var f = 0; f < currentDateBirthdayPeople.length; f++)
          {
            birthdayString+= currentDateBirthdayPeople[f];
            if(f < currentDateBirthdayPeople.length-1)
            {
              birthdayString+= ", ";
            }
          }
          subDiv.classList.add("birth-day");
        }

        subDiv.title = birthdayString;
        if(i == 0) // class applied first will be applicable so birthdate color will be on priority and its class added first
        {
          subDiv.classList.add("sunday-color");
        }
        if(i == 6)
        {
          subDiv.classList.add("saturday-color");
        }
        bottomRowDiv.appendChild(subDiv);
        currentDateNumber++;

        if (currentDateNumber > lastDateOfMonth) // reached last date of the month
        {
          var x = new Date(currentYear, currentMonth, lastDateOfMonth);
          var dayOnLastDate = x.getDay();
          if(dayOnLastDate != 6) // if last date is not on saturday  print next month dates
          {
            var nextMonthDate = 1; // variable for printing dates of next month starting from 1
            var l = i; // variable tp print dates after the day of the last date of the current month

            while(l < 6)
            {
              var subDiv = document.createElement("div");
              subDiv.className = "sub-div";
              subDiv.classList.add("disabled-dates");
              subDiv.innerHTML = nextMonthDate;
              bottomRowDiv.appendChild(subDiv);
              nextMonthDate++;
              l++;
            }
          }

          breakInfiniteLoop = true; // as reached last date of the current month , print remaining required dates of the next month and break from the loop
          document.getElementById("bottom-row-parent-div").appendChild(bottomRowDiv);
          break;
        }
      }
      if (i == 6) // reached saturday , so add the current row and make the new row
      {
        document.getElementById("bottom-row-parent-div").appendChild(bottomRowDiv);
        var bottomRowDiv = document.createElement("div");
        bottomRowDiv.className = "bottom-row-div";
        continue;
      }
    }
    if (breakInfiniteLoop == true) break;
  }
}

function leftArrowClicked()
{
  if(currentMonth == 0)
  {
    currentYear = currentYear-1;
    currentMonth = 11;
  }
  else {
    currentMonth = --currentMonth;
  }
  resetDiv(); // clearing the weekdays nd dates div as will be made dynamically for each month
  setCalendar();
}

function rightArrowClicked()
{
  if(currentMonth==11)
  {
    currentYear = currentYear+1;
    currentMonth = 0;
  }
  else {
    currentMonth = ++currentMonth;
  }
  resetDiv();
  setCalendar();
}

function resetDiv ()
{
  var topRow = document.getElementById("top-row-div");
  var bottomRow = document.getElementById("bottom-row-parent-div");
  document.getElementById("inner-container-3").removeChild(topRow);
  document.getElementById("inner-container-3").removeChild(bottomRow);
}

function getCalendar()
{
  var month = document.getElementById("input-month").value;
  var year = document.getElementById("input-year").value;

  if(month == -1 || year == "")
  {
    document.getElementById("error-msg").innerHTML = "Select a month and year";
    return;
  }
  if(year < 1 || year > 9999)
  {
    document.getElementById("error-msg").innerHTML = "Enter a valid year";
    return;
  }
  
  document.getElementById("error-msg").innerHTML = "";
  currentMonth = month;
  currentYear = year;
  resetDiv();
  setCalendar();
}
