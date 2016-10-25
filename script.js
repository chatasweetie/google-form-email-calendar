//This creates the calendar event with its options
function createEvent_ (namedValues) {
  //options are the key/value pairs you can set when created a 
  //calendar event, below accesses the data given for description 
  //and location - guest is hard coded
  var options = { description: namedValues.Description[0],
                  location: namedValues.Location[0],
                  guests:"jessica.dene.earley@gmail.com"};
  //cEvent makdes the calendar event, You have to choose the calendar 
  //name that you would like to use, then ask for the Name of the event, 
  //start date and end date, then passes the options you have selected above
  var cEvent = CalendarApp.getCalendarsByName("Example")[0].createEvent(
                  namedValues.Name[0], 
                  new Date(namedValues.Starts), 
                  new Date(namedValues.Ends), 
                  options)

}

//this connects the submission of a google form (which creates a record on a 
//spreadsheet) to call the EmailGoogleFormData function
function Initialize() {
  try {
    var triggers = ScriptApp.getProjectTriggers();
    for (var i in triggers)
      ScriptApp.deleteTrigger(triggers[i]);
    ScriptApp.newTrigger("EmailGoogleFormData")
      .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
      .onFormSubmit().create();
  } catch (error) {
    throw new Error("Please add this code in the Google Spreadsheet");
  }
}

//calls the createEvent_ then creates and send the email
function EmailGoogleFormData(e) {
  createEvent_(e.namedValues);
 
  if (!e) {
    throw new Error("Please go the Run menu and choose Initialize");
  }
  try {
    if (MailApp.getRemainingDailyQuota() > 0) {
      //who you want to email
      var email = "jessica.dene.earley@gmail.com";
      // the subject title of the email
      var subject = "New Event";
      //grabs the keys and data for iternations on below
      var key, entry,
        message = "",
        ss = SpreadsheetApp.getActiveSheet(),
        cols = ss.getRange(1, 1, 1, ss.getLastColumn()).getValues()[0];
      
      // Iterate through the Form Fields to build the entry
      for (var keys in cols) {
 
        key = cols[keys];
        entry = e.namedValues[key] ? e.namedValues[key].toString() : "";

        // Only include form fields that are not blank
        if ((entry !== "") && (entry.replace(/,/g, "") !== ""))
          //builds the message
          message += key + ' : ' + entry + "\n\n";
      }
      //sends the email with the who your emailing, the subject title and the message(body)
      MailApp.sendEmail(email, subject, message);
    }
  } catch (error) {
    Logger.log(error.toString());
  }
}