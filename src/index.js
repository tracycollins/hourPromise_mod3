
const actionsDiv = document.querySelector("#actions")
const currentUserDiv = document.querySelector("#current-user")
const currentUserErrorDiv = document.querySelector("#current-user-error")
const commitmentCardHeaderDiv = document.querySelector("#commitment-card-header")
const commitmentCardBodyDiv = document.querySelector("#commitment-card-body")
const commitmentCardFooterDiv = document.querySelector("#commitment-card-footer")

let currentUser
let currentCause
let currentCommitment

const getCauses = () => {
  fetch("http://localhost:3000/causes")
    .then(res => res.json())
    .then(causes => {
      console.log(causes)
      return causes
    })
    .catch(err => {
      console.error("getCauses error: ", err)
      throw err;
    })
}

let showLoginForm = () => {
  currentUserDiv.innerHTML = ""
  currentUserErrorDiv.innerHTML = ""
  commitmentCardHeaderDiv.innerHTML = ""
  commitmentCardBodyDiv.innerHTML = ""
  commitmentCardFooterDiv.innerHTML = ""
  actionsDiv.innerHTML = ""

  let loginForm = document.createElement("form")
  loginForm.classList.add("centered")
  // loginForm.classList.add("form-inline")

  let loginFormGroupDiv = document.createElement('div')
  loginFormGroupDiv.className = "form-group"

  let usernameLabel = document.createElement("label")
  usernameLabel.htmlFor = "username"
  usernameLabel.innerText = "Username"

  let usernameInput = document.createElement("input")
  usernameInput.type = "text"
  usernameInput.className = "form-control"
  usernameInput.id = "username"
  usernameInput.placeholder = "Enter Username"
  usernameInput.autocomplete = "off"

  loginFormGroupDiv.append(usernameLabel, usernameInput)

  let submitButton = document.createElement('button')
  submitButton.type = "submit"
  submitButton.className = "btn btn-primary"
  submitButton.innerText = "Login"

  loginForm.append(loginFormGroupDiv, submitButton)

  currentUserDiv.append(loginForm)
  loginForm.addEventListener("submit", handleLoginForm)

}

let showCommitmentCauseSelectForm = () => {

  commitmentCardHeaderDiv.innerHTML = ""
  commitmentCardBodyDiv.innerHTML = ""
  commitmentCardFooterDiv.innerHTML = ""

  fetch("http://localhost:3000/causes")
    .then(res => res.json())
    .then(causes => {
      console.log(causes)

      let commitmentCauseSelectForm = document.createElement("form")
      commitmentCauseSelectForm.classList.add("centered")

      let formCausesDiv = document.createElement('div')
      formCausesDiv.className = "form-group"

      let formCausesLabel = document.createElement("label")
      formCausesLabel.htmlFor = "cause"
      formCausesLabel.innerText = "Causes"
      formCausesDiv.append(formCausesLabel)

      let formCausesSelect = document.createElement("select")
      formCausesSelect.id = "cause"
      formCausesSelect.className = "form-control"

      causes.forEach(cause => {
        let option = document.createElement("option")
        option.innerText = cause.name
        option.value = JSON.stringify(cause)
        formCausesSelect.append(option)
      })

      formCausesDiv.append(formCausesLabel, formCausesSelect)

      let submitButton = document.createElement('button')
      submitButton.type = "submit"
      submitButton.className = "btn btn-primary"
      submitButton.innerText = "Select Cause"

      commitmentCauseSelectForm.append(formCausesDiv, submitButton)

      commitmentCardBodyDiv.append(commitmentCauseSelectForm)

      commitmentCauseSelectForm.addEventListener("submit", (evt) => {

        evt.preventDefault()

        currentCause = JSON.parse(evt.target.cause.value)
        console.log("selected cause: ", currentCause)

        currentCommitment = {}
        currentCommitment.user_id = currentUser.id
        currentCommitment.cause_id = currentCause.id

        showCommitmentPaymentAmountForm()
      })
    })
    .catch(err => {
      console.error("getCauses error: ", err)
      throw err;
    })

}

// "payment" can be in $$$ and/or HOURS
// each step has a "BACK" button
// ----------------------------------------------------------
// PROMPT: enter payment amount ($$$ and/or hours)

// PROMPT: recurring?

// if (recurring_payment)
//    set payment.isRecurring = true
//    PROMPT: select start_date (display calendar)
//    PROMPT: select end_date OR number_of_payments (display calendar AND number_of_payments input)
// else one-time payment
//    set payment.isRecurring = false
//    PROMPT: select start_date  (display calendar)

// calculate number of payments; end_date; total payment
// DISPLAY new commitment + payments 
// PROMPT: Create Promise/Commitment | Cancel | Back

let showCommitmentPaymentScheduleForm = () => {

  commitmentCardBodyDiv.innerHTML = ""

  let commitmentPaymentScheduleForm = document.createElement("form")
  commitmentPaymentScheduleForm.classList.add("centered")

  let formScheduleDiv = document.createElement('div')
  formScheduleDiv.className = "form-group"

  let commitmentPaymentStartDateLabel = document.createElement("label")
  commitmentPaymentStartDateLabel.htmlFor = "start_date"
  commitmentPaymentStartDateLabel.innerText = "Start Date"

  let commitmentPaymentStartDateInput = document.createElement("input")
  commitmentPaymentStartDateInput.id = "payment_start_date"
  commitmentPaymentStartDateInput.type = "date"
  commitmentPaymentStartDateInput.className = "form-control"

  let commitmentPaymentEndDateLabel = document.createElement("label")
  commitmentPaymentEndDateLabel.htmlFor = "end_date"
  commitmentPaymentEndDateLabel.innerText = "End Date"

  let commitmentPaymentEndDateInput = document.createElement("input")
  commitmentPaymentEndDateInput.id = "payment_end_date"
  commitmentPaymentEndDateInput.type = "date"
  commitmentPaymentEndDateInput.className = "form-control"

  let commitmentPaymentNumberLabel = document.createElement("label")
  commitmentPaymentNumberLabel.htmlFor = "payment_number"
  commitmentPaymentNumberLabel.innerText = "Number of payments"

  let commitmentPaymentNumberInput = document.createElement("input")
  commitmentPaymentNumberInput.id = "payment_number"
  commitmentPaymentNumberInput.className = "form-control"

  formScheduleDiv.append(
    commitmentPaymentStartDateLabel,
    commitmentPaymentStartDateInput,
    commitmentPaymentEndDateLabel,
    commitmentPaymentEndDateInput,
    commitmentPaymentNumberLabel,
    commitmentPaymentNumberInput
  )

  let submitButton = document.createElement('button')
  submitButton.type = "submit"
  submitButton.className = "btn btn-primary"
  submitButton.innerText = "Next"

  let backButton = document.createElement('button')
  backButton.className = "btn btn-secondary"
  backButton.innerText = "Back"
  backButton.addEventListener("click", (evt) => {
    showCommitmentPaymentAmountForm()
  })

  commitmentPaymentScheduleForm.append(formScheduleDiv, backButton, submitButton)

  commitmentCardBodyDiv.append(commitmentPaymentScheduleForm)

  commitmentPaymentScheduleForm.addEventListener("submit", (evt) => {
    evt.preventDefault()
    // t.date : created_date
    // t.date : start_date
    // t.integer : fund_amount
    // t.boolean : fund_recurring
    // t.integer : funds_donated
    // t.integer : hour_amount
    // t.boolean : hour_recurring
    // t.integer : hours_donated
    // t.string : status
    // t.integer : user_id
    // t.integer : cause_id

    currentCommitment.start_date = evt.target.payment_start_date.value
    currentCommitment.end_date = evt.target.payment_end_date.value
    currentCommitment.payment_number = evt.target.payment_number.value

    showCommitmentCreateConfirmation()
  })

}

let createNewCommitment = () => {
  commitmentCardBodyDiv.innerHTML = ""
  console.log("createNewCommitment ", currentCommitment)

  fetch("http://localhost:3000/commitments/create", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      commitment: currentCommitment
    })
  })
    .then(res => res.json())
    .then(response => {
      if (response.id) {
        currentCommitment = response
      } else {
        console.error(response)
      }
    })
}

let showCommitment = (params) => {

  console.log(currentCommitment)

  commitmentCardBodyDiv.innerHTML = ""
  // < h5 class="card-title" > Card title</h5 >
  // < h6 class="card-subtitle mb-2 text-muted" > Card subtitle</h6 >

  const cardHeader = document.createElement("h4")
  cardHeader.classList.add("card-header")
  cardHeader.innerText = "New Promise"

  const cardTitle = document.createElement("h5")
  cardTitle.classList.add("card-title")
  cardTitle.innerText = currentCause.org.name

  const cardSubtitle = document.createElement("h6")
  cardSubtitle.classList.add("card-subtitle")
  cardSubtitle.classList.add("mb-2")
  cardSubtitle.classList.add("text-muted")
  cardSubtitle.innerText = currentCause.org.tagline

  const commitmentForm = document.createElement("form")
  const tableResponsiveDiv = document.createElement("div")
  tableResponsiveDiv.className = "table-responsive"

  const cardTable = document.createElement("table")
  cardTable.className = "table"

  const tableBody = document.createElement("tbody")

  // MONEY ==========
  const tableFundRow = document.createElement("tr")
  const tableFundAmountLabelCell = document.createElement("th")
  tableFundAmountLabelCell.innerText = "Monthly Promises($):"
  const tableFundAmountCell = document.createElement("td")

  const tableFundAmountInput = document.createElement("input")
  tableFundAmountInput.name = "fund_amount"
  tableFundAmountInput.type = "number"
  tableFundAmountInput.value = parseInt(currentCommitment.fund_amount)

  tableFundAmountCell.append(tableFundAmountInput)
  tableFundRow.append(tableFundAmountLabelCell)
  tableFundRow.append(tableFundAmountCell)
  tableBody.append(tableFundRow)

  // TIME ==========
  const tableHourRow = document.createElement("tr")
  const tableHourAmountLabelCell = document.createElement("th")
  tableHourAmountLabelCell.innerText = "Monthly Promise (hours):"
  const tableHourAmountCell = document.createElement("td")

  const tableHourAmountInput = document.createElement("input")
  tableHourAmountInput.name = "hour_amount"
  tableHourAmountInput.type = "number"
  tableHourAmountInput.value = parseInt(currentCommitment.hour_amount)

  tableHourAmountCell.append(tableHourAmountInput)
  tableHourRow.append(tableHourAmountLabelCell)
  tableHourRow.append(tableHourAmountCell)
  tableBody.append(tableHourRow)

  // START DATE ==========
  const tablePaymentStartRow = document.createElement("tr")
  const tablePaymentStartLabelCell = document.createElement("th")
  tablePaymentStartLabelCell.innerText = "Start:"
  const tablePaymentStartCell = document.createElement("td")

  const tablePaymentStartInput = document.createElement("input")
  tablePaymentStartInput.name = "start_date"
  tablePaymentStartInput.type = "date"
  tablePaymentStartInput.value = currentCommitment.start_date

  tablePaymentStartCell.append(tablePaymentStartInput)
  tablePaymentStartRow.append(tablePaymentStartLabelCell)
  tablePaymentStartRow.append(tablePaymentStartCell)
  tableBody.append(tablePaymentStartRow)

  // END DATE ==========
  const tablePaymentEndRow = document.createElement("tr")
  const tablePaymentEndLabelCell = document.createElement("th")
  tablePaymentEndLabelCell.innerText = "End:"
  const tablePaymentEndCell = document.createElement("td")

  const tablePaymentEndInput = document.createElement("input")
  tablePaymentEndInput.name = "end_date"
  tablePaymentEndInput.type = "date"
  tablePaymentEndInput.value = currentCommitment.end_date

  tablePaymentEndCell.append(tablePaymentEndInput)
  tablePaymentEndRow.append(tablePaymentEndLabelCell)
  tablePaymentEndRow.append(tablePaymentEndCell)
  tableBody.append(tablePaymentEndRow)

  // NUM PAYMENTS ==========
  const tablePaymentNumberRow = document.createElement("tr")
  const tablePaymentNumberLabelCell = document.createElement("th")
  tablePaymentNumberLabelCell.innerText = "Number of monthly payments:"
  const tablePaymentNumberCell = document.createElement("td")

  const tablePaymentNumberInput = document.createElement("input")
  tablePaymentNumberInput.name = "end_date"
  tablePaymentNumberInput.type = "number"
  tablePaymentNumberInput.value = currentCommitment.payment_number

  tablePaymentNumberCell.append(tablePaymentNumberInput)
  tablePaymentNumberRow.append(tablePaymentNumberLabelCell)
  tablePaymentNumberRow.append(tablePaymentNumberCell)
  tableBody.append(tablePaymentNumberRow)

  cardTable.append(tableBody)

  let confirmCreateCommitmentButton = document.createElement('button')
  confirmCreateCommitmentButton.className = "btn btn-primary"
  confirmCreateCommitmentButton.innerText = "Submit New Promise?"

  confirmCreateCommitmentButton.addEventListener("click", (evt) => {
    createNewCommitment()
  })

  let backButton = document.createElement('button')
  backButton.className = "btn btn-secondary"
  backButton.innerText = "Back"
  backButton.addEventListener("click", (evt) => {
    showCommitmentPaymentScheduleForm()
  })

  commitmentCardBodyDiv.append(cardHeader, cardTitle, cardSubtitle, cardTable, backButton, confirmCreateCommitmentButton,)
}

let showCommitmentCreateConfirmation = () => {
  showCommitment({ isConfirmation: true })
}

let showCommitmentPaymentAmountForm = () => {

  commitmentCardBodyDiv.innerHTML = ""

  let commitmentPaymentAmountForm = document.createElement("form")
  commitmentPaymentAmountForm.classList.add("centered")

  let formPaymentDiv = document.createElement('div')
  formPaymentDiv.className = "form-group"

  let formPaymentMoneyLabel = document.createElement("label")
  formPaymentMoneyLabel.htmlFor = "money"
  formPaymentMoneyLabel.innerText = "Money"

  let formPaymentMoneyInput = document.createElement("input")
  formPaymentMoneyInput.id = "payment_amount_money"
  formPaymentMoneyInput.className = "form-control"

  let formPaymentTimeLabel = document.createElement("label")
  formPaymentTimeLabel.htmlFor = "time"
  formPaymentTimeLabel.innerText = "Time"

  let formPaymentTimeInput = document.createElement("input")
  formPaymentTimeInput.id = "payment_amount_time"
  formPaymentTimeInput.className = "form-control"

  formPaymentDiv.append(formPaymentMoneyLabel, formPaymentMoneyInput, formPaymentTimeLabel, formPaymentTimeInput)

  let submitButton = document.createElement('button')
  submitButton.type = "submit"
  submitButton.className = "btn btn-primary"
  submitButton.innerText = "Next"

  let backButton = document.createElement('button')
  backButton.className = "btn btn-secondary"
  backButton.innerText = "Back"
  backButton.addEventListener("click", (evt) => {
    showCommitmentCauseSelectForm(currentUser)
  })

  commitmentPaymentAmountForm.append(formPaymentDiv, backButton, submitButton)

  commitmentCardBodyDiv.append(commitmentPaymentAmountForm)

  commitmentPaymentAmountForm.addEventListener("submit", (evt) => {
    evt.preventDefault()
    console.log("payment_amount_money: ", evt.target.payment_amount_money.value)
    console.log("payment_amount_time: ", evt.target.payment_amount_time.value)

    // t.date : created_date
    // t.date : start_date
    // t.integer : fund_amount
    // t.boolean : fund_recurring
    // t.integer : funds_donated
    // t.integer : hour_amount
    // t.boolean : hour_recurring
    // t.integer : hours_donated
    // t.string : status
    // t.integer : user_id
    // t.integer : cause_id

    currentCommitment.fund_amount = evt.target.payment_amount_money.value
    currentCommitment.hour_amount = evt.target.payment_amount_time.value

    showCommitmentPaymentScheduleForm()
  })
}

let handleLoginForm = (evt) => {

  evt.preventDefault()

  let username = evt.target.username.value

  fetch("http://localhost:3000/users/login", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      usernameFromFrontEnd: username
    })
  })
    .then(res => res.json())
    .then(response => {
      if (response.id) {
        currentUser = response
        showUserInformation(currentUser)
      } else {
        showUserLoginError(response)
      }
    })
}

let showUserInformation = (user) => {
  setCurrentUser(user)
  setActions()
  showUserCommmitments()
}

let showUserLoginError = (response) => {
  currentUserErrorDiv.innerHTML = response.error
}

// ------------ SET SIDE BAR AFTER LOGIN ------------

let setCurrentUser = (user) => {
  currentUserDiv.innerHTML = ""
  currentUserErrorDiv.innerHTML = ""
  let username = document.createElement("p")
  username.className = "font-weight-bold"
  username.innerText = `Logged in as ${user.name}`

  let logOutButton = document.createElement("button")
  logOutButton.className = "btn btn-danger"
  logOutButton.innerText = "Logout"

  currentUserDiv.append(username, logOutButton)

  logOutButton.addEventListener("click", (evt) => {
    logOut()
  })

}

let setActions = () => {
  actionsDiv.innerHTML = ""

  let createCommitmentButton = document.createElement("button")
  createCommitmentButton.id = "create-commitment-button"
  createCommitmentButton.className = "btn btn-primary"
  createCommitmentButton.innerText = "Create Promise"

  actionsDiv.append(createCommitmentButton)

  createCommitmentButton.addEventListener("click", (evt) => {
    currentCause = {}
    currentCommitment = {}
    createCommitmentButton.remove()
    showCommitmentCauseSelectForm()
  })
}

const showUserCommmitments = () => {

  commitmentCardBodyDiv.innerHTML = ""

  const table = document.createElement("table")
  table.className = "table"

  const tableHeader = document.createElement("thead")
  const tableHeaderRow = document.createElement("tr")
  const tableBody = document.createElement("tbody")

  const commitmentHeaderCause = document.createElement("th")
  const commitmentHeaderStatus = document.createElement("th")
  const commitmentHeaderStartDate = document.createElement("th")
  const commitmentHeaderEndDate = document.createElement("th")
  const commitmentHeaderFundAmount = document.createElement("th")
  const commitmentHeaderFundRecurring = document.createElement("th")
  const commitmentHeaderFundsDonated = document.createElement("th")
  const commitmentHeaderHourAmount = document.createElement("th")
  const commitmentHeaderHourRecurring = document.createElement("th")
  const commitmentHeaderHoursDonated = document.createElement("th")

  commitmentHeaderCause.innerText = "Cause"
  commitmentHeaderStatus.innerText = "Status"
  commitmentHeaderStartDate.innerText = "Start"
  commitmentHeaderEndDate.innerText = "End"
  commitmentHeaderFundAmount.innerText = "$"
  commitmentHeaderFundRecurring.innerText = "$ recurring"
  commitmentHeaderFundsDonated.innerText = "Current $ Total"
  commitmentHeaderHourAmount.innerText = "Hour"
  commitmentHeaderHourRecurring.innerText = "Hour Recurring"
  commitmentHeaderHoursDonated.innerText = "Current Hour Total"

  commitmentHeaderCause.scope = "col"
  commitmentHeaderStatus.scope = "col"
  commitmentHeaderStartDate.scope = "col"
  commitmentHeaderEndDate.scope = "col"
  commitmentHeaderFundAmount.scope = "col"
  commitmentHeaderFundRecurring.scope = "col"
  commitmentHeaderFundsDonated.scope = "col"
  commitmentHeaderHourAmount.scope = "col"
  commitmentHeaderHourRecurring.scope = "col"
  commitmentHeaderHoursDonated.scope = "col"

  tableHeaderRow.append(
    commitmentHeaderCause,
    commitmentHeaderStatus,
    commitmentHeaderStartDate,
    commitmentHeaderEndDate,
    commitmentHeaderFundAmount,
    commitmentHeaderFundRecurring,
    commitmentHeaderFundsDonated,
    commitmentHeaderHourAmount,
    commitmentHeaderHourRecurring,
    commitmentHeaderHoursDonated
  )

  currentUser.commitments.forEach(commitment => {

    const tableRow = document.createElement("tr")
    tableRow.scope = "row"

    const cellName = document.createElement("td")
    cellName.innerText = commitment.cause.name

    const cellStatus = document.createElement("td")
    cellStatus.innerText = commitment.cause.status

    const cellStartDate = document.createElement("td")
    cellStartDate.innerText = commitment.cause.start_date

    const cellEndDate = document.createElement("td")
    cellEndDate.innerText = commitment.cause.end_date

    const cellFundAmount = document.createElement("td")
    cellFundAmount.innerText = commitment.fund_amount

    const cellFundRecurring = document.createElement("td")
    cellFundRecurring.innerText = commitment.fund_recurring

    const cellFundsDonated = document.createElement("td")
    cellFundsDonated.innerText = commitment.funds_donated

    const cellHourAmount = document.createElement("td")
    cellHourAmount.innerText = commitment.hour_amount

    const cellHourRecurring = document.createElement("td")
    cellHourRecurring.innerText = commitment.hour_recurring

    const cellHoursDonated = document.createElement("td")
    cellHoursDonated.innerText = commitment.hours_donated

    tableRow.append(
      cellName,
      cellStatus,
      cellStartDate,
      cellEndDate,
      cellFundAmount,
      cellFundRecurring,
      cellFundsDonated,
      cellHourAmount,
      cellHourRecurring,
      cellHoursDonated
    )

    tableBody.append(tableRow)
  })

  tableHeader.append(tableHeaderRow)
  table.append(tableHeader)
  table.append(tableBody)

  commitmentCardBodyDiv.append(table)
}

let logOut = () => {
  showLoginForm()
}

showLoginForm()
