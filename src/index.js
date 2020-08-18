const configuration = {}
configuration.commitment = {}
configuration.commitment.cause = {}
configuration.commitment.cause.id = null
configuration.commitment.fund = {}
configuration.commitment.fund.default = {}
configuration.commitment.fund.default.donated = 0
configuration.commitment.fund.default.duration_months = 12
configuration.commitment.fund.default.amount = 10
configuration.commitment.fund.default.goal = configuration.commitment.fund.default.duration_months * configuration.commitment.fund.default.amount
configuration.commitment.hour = {}
configuration.commitment.hour.default = {}
configuration.commitment.hour.default.donated = 0
configuration.commitment.hour.default.duration_months = 12
configuration.commitment.hour.default.amount = 4
configuration.commitment.hour.default.goal = configuration.commitment.hour.default.duration_months * configuration.commitment.hour.default.amount

const actionsDiv = document.querySelector("#actions")
const currentUserDiv = document.querySelector("#current-user")
const currentUserErrorDiv = document.querySelector("#current-user-error")

const commitmentDiv = document.querySelector("#commitment")
const commitmentCardHeaderDiv = document.querySelector("#commitment-card-header")
const commitmentCardBodyDiv = document.querySelector("#commitment-card-body")
const commitmentCardFooterDiv = document.querySelector("#commitment-card-footer")

const defaultDateTimeFormat = "YYYY-MM-DD"
const MINIMUM_WAGE = 8

let currentUser = {}
currentUser.username = "threecee"
currentUser.name = "Tracy"

let currentCause
let currentCommitment
let orgs = new Set()
let causes = []

const displayCurrentCommitment = () => {

  commitmentCardBodyDiv.innerHTML = ""
  commitmentCardHeaderDiv.innerText = "Your New Promise"
  commitmentCardFooterDiv.innerText = `Thank you, ${currentUser.name}`

  const commitmentCardCauseDiv = document.createElement("div")
  const commitmentCardPromiseDiv = document.createElement("div")
  commitmentCardPromiseDiv.classList.add("promise")

  const orgName = document.createElement("h5")
  // orgName.classList.add("card-title")
  orgName.innerHTML = `<strong>Organization</strong><br>${currentCommitment.cause.org.name}<hr>`

  const causeName = document.createElement("h5")
  // causeName.classList.add("card-subtitle")
  causeName.classList.add("mb-2")
  causeName.innerHTML = `<strong>Cause</strong><br>${currentCommitment.cause.name}<hr>`

  const causeDescription = document.createElement("p")
  causeDescription.classList.add("mb-2")
  causeDescription.innerHTML = `<strong>Description</strong><br>${currentCommitment.cause.description}<hr>`

  const causeTarget = document.createElement("h5")
  // causeTarget.classList.add("mb-2")
  causeTarget.innerHTML = `<strong>Targets</strong><br>$${currentCommitment.cause.fund_target} | ${currentCommitment.cause.hour_target} Hours<hr>`

  commitmentCardCauseDiv.append(orgName, causeName, causeDescription, causeTarget)
  commitmentCardBodyDiv.append(commitmentCardCauseDiv)

  // promise progress fund
  const promiseFundProgressDiv = document.createElement("div")
  promiseFundProgressDiv.id = "promise-fund-progress-div"
  promiseFundProgressDiv.classList.add("progress")

  const commitmentFundProgressPercent = 100 * (currentCommitment.fund_donated / currentCommitment.fund_goal)

  const promiseFundProgressInfo = document.createElement("p")
  promiseFundProgressInfo.id = "promise-fund-progress-info"
  promiseFundProgressInfo.innerHTML = `Fund Progress: $ ${currentCommitment.fund_donated} of ${currentCommitment.fund_goal}`

  const promiseFundProgressBar = document.createElement("div")
  promiseFundProgressBar.classList.add("progress-bar")
  promiseFundProgressBar.id = "promise-fund-progress-bar"
  promiseFundProgressBar.role = "progressbar"
  promiseFundProgressBar.style.width = commitmentFundProgressPercent + "%"
  promiseFundProgressBar.valuemin = 0
  promiseFundProgressBar.valuenow = commitmentFundProgressPercent
  promiseFundProgressBar.valuemax = 100
  promiseFundProgressBar.innerText = commitmentFundProgressPercent + "%"

  promiseFundProgressDiv.append(promiseFundProgressBar)
  commitmentCardPromiseDiv.append(promiseFundProgressInfo, promiseFundProgressDiv)

  // promise progress hour
  const promiseHourProgressDiv = document.createElement("div")
  promiseHourProgressDiv.id = "promise-hour-progress-div"
  promiseHourProgressDiv.classList.add("progress")

  const commitmentHourProgressPercent = 100 * (currentCommitment.hour_donated / currentCommitment.hour_goal)

  const promiseHourProgressInfo = document.createElement("p")
  promiseHourProgressInfo.id = "promise-hour-progress-info"
  promiseHourProgressInfo.innerHTML = `Hour Progress: $ ${currentCommitment.hour_donated} of ${currentCommitment.hour_goal}`

  const promiseHourProgressBar = document.createElement("div")
  promiseHourProgressBar.classList.add("progress-bar")
  promiseHourProgressBar.id = "promise-hour-progress-bar"
  promiseHourProgressBar.role = "progressbar"
  promiseHourProgressBar.style.width = commitmentHourProgressPercent + "%"
  promiseHourProgressBar.valuemin = 0
  promiseHourProgressBar.valuenow = commitmentHourProgressPercent
  promiseHourProgressBar.valuemax = 100
  promiseHourProgressBar.innerText = commitmentHourProgressPercent + "%"

  promiseHourProgressDiv.append(promiseHourProgressBar)
  commitmentCardPromiseDiv.append(promiseHourProgressInfo, promiseHourProgressDiv)

  commitmentCardBodyDiv.append(commitmentCardPromiseDiv)

  setActions()
}

let createCommitment = (params) => {

  console.log(currentCommitment)

  commitmentCardHeaderDiv.innerText = "Creating a new promise"
  commitmentCardBodyDiv.innerHTML = ""

  const commitmentForm = document.createElement("form")

  const tableResponsiveDiv = document.createElement("div")
  tableResponsiveDiv.className = "table"

  const cardTable = document.createElement("table")
  cardTable.className = "table"

  const tableBody = document.createElement("tbody")

  // ORG ==========
  const tableOrgRow = document.createElement("tr")
  const tableOrgLabelCell = document.createElement("th")
  tableOrgLabelCell.innerText = "Org"
  const tableOrgCell = document.createElement("td")

  let tableOrgSelect = document.createElement("select")
  tableOrgSelect.id = "org_id"
  tableOrgSelect.className = "form-control"

  orgs.clear()
  orgs.add("all") // if set to "all" won't filter available causes (shows all causes)

  let optionAll = document.createElement("option")
  optionAll.innerText = "All Orgs"
  optionAll.value = 0
  tableOrgSelect.append(optionAll)
  tableOrgSelect.selectedIndex = 0

  causes.forEach(cause => {
    if (!orgs.has(cause.org.id)) {
      orgs.add(cause.org.id)
      let option = document.createElement("option")
      option.innerText = cause.org.name
      option.value = cause.org.id
      tableOrgSelect.append(option)
    }
  })

  tableOrgCell.append(tableOrgSelect)
  tableOrgRow.append(tableOrgLabelCell)
  tableOrgRow.append(tableOrgCell)
  tableBody.append(tableOrgRow)

  // CAUSE ==========
  const tableCauseRow = document.createElement("tr")
  const tableCauseLabelCell = document.createElement("th")
  tableCauseLabelCell.innerText = "Cause"
  const tableCauseCell = document.createElement("td")

  let tableCauseSelect = document.createElement("select")
  tableCauseSelect.id = "cause_id"
  tableCauseSelect.className = "form-control"

  causes.forEach(cause => {
    let option = document.createElement("option")
    option.innerText = cause.name
    option.value = cause.id
    tableCauseSelect.append(option)
  })

  tableCauseCell.append(tableCauseSelect)
  tableCauseRow.append(tableCauseLabelCell)
  tableCauseRow.append(tableCauseCell)
  tableBody.append(tableCauseRow)

  // update available causes on change of org select
  tableOrgSelect.addEventListener("change", (evt) => {

    const currentSelectedOrgId = parseInt(evt.target.value)

    console.log(`currentSelectedOrgId: ${currentSelectedOrgId}`)

    tableCauseSelect.innerHTML = ""

    causes.forEach(cause => {
      if (currentSelectedOrgId === 0 || currentSelectedOrgId === parseInt(cause.org.id)) {
        let option = document.createElement("option")
        option.innerText = cause.name
        option.value = cause.id
        tableCauseSelect.append(option)
      }
    })

  })


  // FUND GOAL ==========
  const tableFundGoalRow = document.createElement("tr")
  const tableFundGoalLabelCell = document.createElement("th")
  tableFundGoalLabelCell.innerText = "Fund Goal:"
  const tableFundGoalCell = document.createElement("td")

  const tableFundGoalInput = document.createElement("input")
  tableFundGoalInput.name = "fund_goal"
  tableFundGoalInput.type = "number"
  tableFundGoalInput.value = parseInt(currentCommitment.fund_goal)

  tableFundGoalCell.append(tableFundGoalInput)
  tableFundGoalRow.append(tableFundGoalLabelCell)
  tableFundGoalRow.append(tableFundGoalCell)
  tableBody.append(tableFundGoalRow)

  // FUND AMOUNT ==========
  const tableFundAmountRow = document.createElement("tr")
  const tableFundAmountLabelCell = document.createElement("th")
  tableFundAmountLabelCell.innerText = "Monthly Promise ($):"
  const tableFundAmountCell = document.createElement("td")

  const tableFundAmountInput = document.createElement("input")
  tableFundAmountInput.name = "fund_amount"
  tableFundAmountInput.type = "number"
  tableFundAmountInput.value = parseInt(currentCommitment.fund_amount)

  tableFundAmountCell.append(tableFundAmountInput)
  tableFundAmountRow.append(tableFundAmountLabelCell)
  tableFundAmountRow.append(tableFundAmountCell)
  tableBody.append(tableFundAmountRow)

  // FUND START DATE ==========
  const tableFundPaymentStartRow = document.createElement("tr")
  const tableFundPaymentStartLabelCell = document.createElement("th")
  tableFundPaymentStartLabelCell.innerText = "Fund Start:"
  const tableFundPaymentStartCell = document.createElement("td")

  const tableFundPaymentStartInput = document.createElement("input")
  tableFundPaymentStartInput.name = "fund_start_date"
  tableFundPaymentStartInput.type = "date"
  tableFundPaymentStartInput.value = currentCommitment.fund_start_date

  tableFundPaymentStartCell.append(tableFundPaymentStartInput)
  tableFundPaymentStartRow.append(tableFundPaymentStartLabelCell)
  tableFundPaymentStartRow.append(tableFundPaymentStartCell)
  tableBody.append(tableFundPaymentStartRow)

  // FUND END DATE ==========
  const tableFundPaymentEndRow = document.createElement("tr")
  const tableFundPaymentEndLabelCell = document.createElement("th")
  tableFundPaymentEndLabelCell.innerText = "Fund End:"
  const tableFundPaymentEndCell = document.createElement("td")

  const tableFundPaymentEndInput = document.createElement("input")
  tableFundPaymentEndInput.name = "fund_end_date"
  tableFundPaymentEndInput.type = "date"
  tableFundPaymentEndInput.value = currentCommitment.fund_end_date

  tableFundPaymentEndCell.append(tableFundPaymentEndInput)
  tableFundPaymentEndRow.append(tableFundPaymentEndLabelCell)
  tableFundPaymentEndRow.append(tableFundPaymentEndCell)
  tableBody.append(tableFundPaymentEndRow)

  // FUND RECURRING ==========
  const tableFundRecurringRow = document.createElement("tr")
  const tableFundRecurringLabelCell = document.createElement("th")
  tableFundRecurringLabelCell.innerText = "Recurring Payments:"
  const tableFundRecurringCell = document.createElement("td")

  const tableFundRecurringInput = document.createElement("input")
  tableFundRecurringInput.name = "fund_recurring"
  tableFundRecurringInput.type = "checkbox"
  tableFundRecurringInput.value = currentCommitment.fund_recurring

  tableFundRecurringCell.append(tableFundRecurringInput)
  tableFundRecurringRow.append(tableFundRecurringLabelCell)
  tableFundRecurringRow.append(tableFundRecurringCell)
  tableBody.append(tableFundRecurringRow)

  // HOUR GOAL ==========
  const tableHourGoalRow = document.createElement("tr")
  const tableHourGoalLabelCell = document.createElement("th")
  tableHourGoalLabelCell.innerText = "Hour Goal:"
  const tableHourGoalCell = document.createElement("td")

  const tableHourGoalInput = document.createElement("input")
  tableHourGoalInput.name = "hour_goal"
  tableHourGoalInput.type = "number"
  tableHourGoalInput.value = parseInt(currentCommitment.hour_goal)

  tableHourGoalCell.append(tableHourGoalInput)
  tableHourGoalRow.append(tableHourGoalLabelCell)
  tableHourGoalRow.append(tableHourGoalCell)
  tableBody.append(tableHourGoalRow)

  // HOUR AMOUNT ==========
  const tableHourAmountRow = document.createElement("tr")
  const tableHourAmountLabelCell = document.createElement("th")
  tableHourAmountLabelCell.innerText = "Monthly Promise (hours):"
  const tableHourAmountCell = document.createElement("td")

  const tableHourAmountInput = document.createElement("input")
  tableHourAmountInput.name = "hour_amount"
  tableHourAmountInput.type = "number"
  tableHourAmountInput.value = parseInt(currentCommitment.hour_amount)

  tableHourAmountCell.append(tableHourAmountInput)
  tableHourAmountRow.append(tableHourAmountLabelCell)
  tableHourAmountRow.append(tableHourAmountCell)
  tableBody.append(tableHourAmountRow)

  // HOUR START DATE ==========
  const tableHourPaymentStartRow = document.createElement("tr")
  const tableHourPaymentStartLabelCell = document.createElement("th")
  tableHourPaymentStartLabelCell.innerText = "Hour Start:"
  const tableHourPaymentStartCell = document.createElement("td")

  const tableHourPaymentStartInput = document.createElement("input")
  tableHourPaymentStartInput.name = "hour_start_date"
  tableHourPaymentStartInput.type = "date"
  tableHourPaymentStartInput.value = currentCommitment.hour_start_date

  tableHourPaymentStartCell.append(tableHourPaymentStartInput)
  tableHourPaymentStartRow.append(tableHourPaymentStartLabelCell)
  tableHourPaymentStartRow.append(tableHourPaymentStartCell)
  tableBody.append(tableHourPaymentStartRow)

  // HOUR END DATE ==========
  const tableHourPaymentEndRow = document.createElement("tr")
  const tableHourPaymentEndLabelCell = document.createElement("th")
  tableHourPaymentEndLabelCell.innerText = "Hour End:"
  const tableHourPaymentEndCell = document.createElement("td")

  const tableHourPaymentEndInput = document.createElement("input")
  tableHourPaymentEndInput.name = "hour_end_date"
  tableHourPaymentEndInput.type = "date"
  tableHourPaymentEndInput.value = currentCommitment.hour_end_date

  tableHourPaymentEndCell.append(tableHourPaymentEndInput)
  tableHourPaymentEndRow.append(tableHourPaymentEndLabelCell)
  tableHourPaymentEndRow.append(tableHourPaymentEndCell)
  tableBody.append(tableHourPaymentEndRow)

  // HOUR RECURRING ==========
  const tableHourRecurringRow = document.createElement("tr")
  const tableHourRecurringLabelCell = document.createElement("th")
  tableHourRecurringLabelCell.innerText = "Recurring Payments:"
  const tableHourRecurringCell = document.createElement("td")

  const tableHourRecurringInput = document.createElement("input")
  tableHourRecurringInput.name = "hour_recurring"
  tableHourRecurringInput.type = "checkbox"
  tableHourRecurringInput.value = currentCommitment.hour_recurring

  tableHourRecurringCell.append(tableHourRecurringInput)
  tableHourRecurringRow.append(tableHourRecurringLabelCell)
  tableHourRecurringRow.append(tableHourRecurringCell)
  tableBody.append(tableHourRecurringRow)

  cardTable.append(tableBody)

  let confirmCreateCommitmentButton = document.createElement('button')
  confirmCreateCommitmentButton.type = "submit"
  confirmCreateCommitmentButton.className = "btn btn-primary"
  confirmCreateCommitmentButton.innerText = "Submit New Promise?"

  commitmentForm.addEventListener("submit", (evt) => {
  })

  commitmentForm.addEventListener("submit", (evt) => {
    evt.preventDefault()
    const formData = new FormData(commitmentForm);

    for (const key of formData.keys()) {
      if (key !== undefined) {
        console.log(`KEY: ${key} | VALUE: ${formData.get(key)}`);
        currentCommitment[key] = formData.get(key)
      }
    }
    currentCommitment.user_id = currentUser.id
    currentCommitment.cause_id = evt.target.cause_id.value
    currentCommitment.fund_recurring = evt.target.fund_recurring.value
    currentCommitment.hour_recurring = evt.target.hour_recurring.value
    createNewCommitment()
  })

  let backButton = document.createElement('button')
  backButton.className = "btn btn-secondary"
  backButton.innerText = "Back"
  backButton.addEventListener("click", (evt) => {
    // showCommitmentPaymentScheduleForm()
  })

  commitmentForm.append(cardTable, backButton, confirmCreateCommitmentButton)
  commitmentCardBodyDiv.append(commitmentForm)
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
        displayCurrentCommitment()
      } else {
        console.error(response)
      }
    })
}

let showCommitmentCreateConfirmation = () => {
  // showCommitment({ isConfirmation: true })
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

const fetchCauses = async () => {

  try {
    const res = await fetch("http://localhost:3000/causes")
    const causes = await res.json()
    return causes
  }
  catch (err) {
    console.error("getCauses error: ", err)
    throw err
  }
}

let setActions = () => {
  actionsDiv.innerHTML = ""

  let createCommitmentButton = document.createElement("button")
  createCommitmentButton.id = "create-commitment-button"
  createCommitmentButton.className = "btn btn-primary"
  createCommitmentButton.innerText = "Create Promise"

  actionsDiv.append(createCommitmentButton)

  createCommitmentButton.addEventListener("click", async (evt) => {

    createCommitmentButton.remove()

    causes = await fetchCauses();

    currentCause = {}

    currentCommitment = {}

    currentCommitment.user_id = currentUserDiv.id
    currentCommitment.cause_id = null
    currentCommitment.status = "open"

    currentCommitment.fund_duration = configuration.commitment.fund.default.duration_months
    currentCommitment.fund_start_date = moment().format(defaultDateTimeFormat)
    currentCommitment.fund_end_date = moment().add(configuration.commitment.fund.default.duration_months, 'months').format(defaultDateTimeFormat)
    currentCommitment.fund_goal = configuration.commitment.fund.default.goal
    currentCommitment.fund_donated = 0
    currentCommitment.fund_amount = configuration.commitment.fund.default.amount
    currentCommitment.fund_recurring = true

    currentCommitment.hour_duration = configuration.commitment.hour.default.duration_months
    currentCommitment.hour_start_date = moment().format(defaultDateTimeFormat)
    currentCommitment.hour_end_date = moment().add(configuration.commitment.hour.default.duration_months, 'months').format(defaultDateTimeFormat)
    currentCommitment.hour_goal = configuration.commitment.hour.default.goal
    currentCommitment.hour_donated = 0
    currentCommitment.hour_amount = configuration.commitment.hour.default.amount
    currentCommitment.hour_recurring = true

    createCommitment()
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
  commitmentHeaderFundRecurring.innerText = "Recurring"
  commitmentHeaderFundsDonated.innerText = "Total"
  commitmentHeaderHourAmount.innerText = "Hour"
  commitmentHeaderHourRecurring.innerText = "Recurring"
  commitmentHeaderHoursDonated.innerText = "Total"

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
    cellFundsDonated.innerText = commitment.fund_donated

    const cellHourAmount = document.createElement("td")
    cellHourAmount.innerText = commitment.hour_amount

    const cellHourRecurring = document.createElement("td")
    cellHourRecurring.innerText = commitment.hour_recurring

    const cellHoursDonated = document.createElement("td")
    cellHoursDonated.innerText = commitment.hour_donated

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

// showLoginForm()

fetch("http://localhost:3000/users/login", {
  method: "POST",
  headers: {
    "content-type": "application/json"
  },
  body: JSON.stringify({
    usernameFromFrontEnd: currentUser.username
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
