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

const containerDiv = document.querySelector("#container")
const mainDiv = document.querySelector("#main-div")
const mainStatusDiv = document.querySelector("#main-status-div")

const navBar = document.querySelector("#navbar-div")
const navBarControlsDiv = document.querySelector("#navbar-controls-div")
navBarControlsDiv.classList.add("d-none")

const showCommitmentsButton = document.createElement("button")
showCommitmentsButton.id = "create-commitment-button"
showCommitmentsButton.className = "btn btn-primary"
showCommitmentsButton.innerText = "My Promises"

const createCommitmentButton = document.createElement("button")
createCommitmentButton.id = "create-commitment-button"
createCommitmentButton.className = "btn btn-primary"
createCommitmentButton.innerText = "Create New Promise"

const logOutButton = document.createElement("button")
logOutButton.id = "logout-button"
logOutButton.className = "btn btn-danger"
logOutButton.innerHTML = "Logout"
logOutButton.addEventListener("click", (evt) => {
  logOut()
})

const showAllOrgsButton = document.createElement("button")
showAllOrgsButton.id = "show-all-orgs-button"
showAllOrgsButton.className = "btn btn-primary"
showAllOrgsButton.innerHTML = "Browse Orgs"
showAllOrgsButton.addEventListener("click", (evt) => {
})

const showUserProfile = document.createElement("button")
showUserProfile.id = "show-user-profile-button"
showUserProfile.className = "btn btn-primary"
showUserProfile.innerHTML = "My Profile"
showUserProfile.addEventListener("click", (evt) => {
})

navBarControlsDiv.append(showAllOrgsButton, showCommitmentsButton, createCommitmentButton, showUserProfile, logOutButton)

const currentUserDiv = document.querySelector("#current-user")
const currentUserErrorDiv = document.querySelector("#current-user-error")

const commitmentDiv = document.querySelector("#commitment")
commitmentDiv.classList.add("d-none")

const orgDiv = document.querySelector("#org")
orgDiv.classList.add("d-none")

const causeCardDiv = document.querySelector("#cause-card")
causeCardDiv.classList.add("d-none")
const causeCardHeaderDiv = document.querySelector("#cause-card-header")
const causeCardBodyDiv = document.querySelector("#cause-card-body")
const causeCardFooterDiv = document.querySelector("#cause-card-footer")

const commitmentCardHeaderDiv = document.querySelector("#commitment-card-header")
const commitmentCardBodyDiv = document.querySelector("#commitment-card-body")
const commitmentCardFooterDiv = document.querySelector("#commitment-card-footer")

const paymentCardDiv = document.querySelector("#payment")
paymentCardDiv.classList.add("d-none")

const paymentCardHeaderDiv = document.querySelector("#payment-card-header")
const paymentCardBodyDiv = document.querySelector("#payment-card-body")
const paymentCardFooterDiv = document.querySelector("#payment-card-footer")

const defaultDateTimeFormat = "YYYY-MM-DD"
const MINIMUM_WAGE = 8

let currentUser = {}
currentUser.username = "threecee"
currentUser.name = "Tracy"

let currentCause
let currentCommitment
let currentPayment

let orgs = new Set()
let causes = []
let commitments = []

const displayPayment = (payment) => {
  console.log(payment)
}

const postPayment = async (newPayment) => {

  try {

    const options = {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ payment: newPayment })
    }

    const res = await fetch("http://localhost:3000/payments/create", options)
    const updatedCommitment = await res.json()

    return updatedCommitment

  }
  catch (err) {
    console.error("postPayment error: ", err)
    throw err
  }

}

const makePayment = async (commitment) => {

  try {

    paymentCardBodyDiv.innerHTML = ""

    commitment.fund_amount = commitment.fund_amount || 0;
    commitment.hour_amount = commitment.hour_amount || 0;

    const newPayment = {
      user_id: currentUser.id,
      commitment_id: commitment.id,
      date: moment().format(defaultDateTimeFormat),
      fund_amount: commitment.fund_amount,
      hour_amount: commitment.hour_amount
    }

    console.log("makePayment ", newPayment)

    const updatedCommitment = await postPayment(newPayment)

    console.log("makePayment | updatedCommitment ", updatedCommitment)

    return updatedCommitment
  }
  catch (err) {
    console.error("makePayment | ERROR ", err)
    throw err
  }

}

const displayProgressBar = (params) => {

  const progressDiv = document.createElement("div")
  progressDiv.id = params.divId
  progressDiv.classList.add(params.class)

  const progressPercent = 100 * (params.currentAmount / params.targetAmount)

  const progressInfo = document.createElement("p")
  progressInfo.id = params.infoId
  progressInfo.innerHTML = params.infoInnerHTML

  const progressBar = document.createElement("div")
  progressBar.classList.add("progress-bar")
  progressBar.id = params.progressBarId
  progressBar.role = "progressbar"
  progressBar.style.width = progressPercent + "%"
  progressBar.valuemin = 0
  progressBar.valuenow = progressPercent
  progressBar.valuemax = 100
  progressBar.innerText = progressPercent.toFixed(0) + "%"

  progressDiv.append(progressBar)
  params.parentDiv.append(progressInfo, progressDiv)

}

const displayCommitment = (commitment) => {

  causeCardDiv.classList.remove("d-none")
  commitmentDiv.classList.remove("d-none")

  causeCardHeaderDiv.innerHTML = ""
  causeCardBodyDiv.innerHTML = ""
  causeCardFooterDiv.innerHTML = ""

  commitmentCardHeaderDiv.innerHTML = ""
  commitmentCardBodyDiv.innerHTML = ""
  commitmentCardFooterDiv.innerHTML = ""

  causeCardHeaderDiv.innerHTML = `Organization<br><h4>${commitment.cause.org.name}</h4><br>Cause<br><h5>${commitment.cause.name}</h5>${commitment.cause.description}`
  causeCardBodyDiv.innerHTML = ``

  const causeTargetFund = document.createElement("div")
  causeTargetFund.classList.add("cause-target")
  causeTargetFund.innerHTML = `<h5>Funding</h5>`
  const causeFundProgressDiv = displayProgressBar({
    parentDiv: causeTargetFund,
    divId: "cause-fund-progress-div",
    class: "progress",
    targetAmount: commitment.cause.fund_target,
    currentAmount: commitment.cause.fund_donated,
    infoId: "cause-fund-progress-info",
    infoInnerHTML: `Goal: $${commitment.cause.fund_target} / Donated: $${commitment.cause.fund_donated}`,
    progressBarId: "cause-fund-progress-bar"
  })

  const causeTargetHour = document.createElement("div")
  causeTargetHour.classList.add("cause-target")
  causeTargetHour.innerHTML = `<h5>Hours</h5>`
  const causeHourProgressDiv = displayProgressBar({
    parentDiv: causeTargetHour,
    divId: "cause-hour-progress-div",
    class: "progress",
    targetAmount: commitment.cause.hour_target,
    currentAmount: commitment.cause.hour_donated,
    infoId: "cause-hour-progress-info",
    infoInnerHTML: `Goal: ${commitment.cause.hour_target} / Donated: ${commitment.cause.hour_donated}`,
    progressBarId: "cause-hour-progress-bar"
  })

  causeCardBodyDiv.append(causeTargetFund, causeTargetHour)

  // USER PROMISE/COMMITMENT

  commitmentCardHeaderDiv.innerHTML = `<h5>Your Promise to ${commitment.cause.name}</h5>`

  const commitmentCardPromiseDiv = document.createElement("div")
  commitmentCardPromiseDiv.classList.add("promise")

  const promiseFundProgressDiv = displayProgressBar({
    parentDiv: commitmentCardPromiseDiv,
    divId: "promise-fund-progress-div",
    class: "progress",
    targetAmount: commitment.fund_goal,
    currentAmount: commitment.fund_donated,
    infoId: "promise-fund-progress-info",
    infoInnerHTML: `Fund Progress: Goal: $${commitment.fund_goal} / Donated: $${commitment.fund_donated}`,
    progressBarId: "promise-fund-progress-bar"
  })

  const promiseHourProgressDiv = displayProgressBar({
    parentDiv: commitmentCardPromiseDiv,
    divId: "promise-hour-progress-div",
    class: "progress",
    targetAmount: commitment.hour_goal,
    currentAmount: commitment.hour_donated,
    infoId: "promise-hour-progress-info",
    infoInnerHTML: `Hour Progress: Goal: ${commitment.hour_goal} / Donated: ${commitment.hour_donated}`,
    progressBarId: "promise-hour-progress-bar"
  })

  const makePaymentButton = document.createElement('button')
  makePaymentButton.className = "btn btn-success"
  makePaymentButton.innerText = "Make A Payment"
  makePaymentButton.addEventListener("click", async (evt) => {
    commitment = await makePayment(commitment)
    displayCommitment(commitment)
  })

  const displayPayments = document.createElement('button')
  displayPayments.className = "btn btn-success"
  displayPayments.innerText = "Payments"
  displayPayments.addEventListener("click", async (evt) => {
  })

  commitmentCardBodyDiv.append(commitmentCardPromiseDiv)
  commitmentCardFooterDiv.append(makePaymentButton, displayPayments)

}

let createCommitment = (params) => {

  commitmentDiv.classList.remove("d-none")

  commitmentCardHeaderDiv.innerHTML = `<h6>Creating a new promise</h6>`
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
  confirmCreateCommitmentButton.innerText = "Submit New Promise"

  commitmentForm.addEventListener("submit", async (evt) => {
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
    currentCommitment = await postCommitment(currentCommitment)
    displayCommitment(currentCommitment)
  })

  // let backButton = document.createElement('button')
  // backButton.className = "btn btn-secondary"
  // backButton.innerText = "Back"
  // backButton.addEventListener("click", (evt) => {
  //   // showCommitmentPaymentScheduleForm()
  // })

  commitmentForm.append(cardTable, confirmCreateCommitmentButton)
  commitmentCardBodyDiv.append(commitmentForm)
}

let showLoginForm = () => {

  currentUserDiv.innerHTML = ""
  currentUserErrorDiv.innerHTML = ""
  commitmentCardHeaderDiv.innerHTML = ""
  commitmentCardBodyDiv.innerHTML = ""
  commitmentCardFooterDiv.innerHTML = ""
  navBarControlsDiv.classList.add("d-none")

  let loginForm = document.createElement("form")
  // loginForm.classList.add("centered")
  // loginForm.classList.add("form-inline")
  // loginForm.className = "form-inline mb-2 mr-sm-2"
  loginForm.className = "form-inline"

  let loginFormGroupDiv = document.createElement('div')
  // loginFormGroupDiv.className = "form-group mb-2 mr-sm-2"
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

const postCommitment = async (commitment) => {

  try {

    const options = {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ commitment: commitment })
    }

    const res = await fetch("http://localhost:3000/commitments/create", options)
    const newCommitment = await res.json()

    return newCommitment

  }
  catch (err) {
    console.error("postCommitment error: ", err)
    throw err
  }

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
  setNavBar()
  displayCommmitments(user.commitments)
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
  username.innerHTML = `Logged in as ${user.name}`
}

const fetchCauses = async () => {
  try {
    const res = await fetch("http://localhost:3000/causes")
    const causes = await res.json()
    return causes
  }
  catch (err) {
    console.error("fetchCauses error: ", err)
    throw err
  }
}

const fetchCommitments = async () => {
  try {
    const res = await fetch(`http://localhost:3000/users/${currentUser.username}/commitments`)
    const commitments = await res.json()
    return commitments
  }
  catch (err) {
    console.error("fetchCommitments error: ", err)
    throw err
  }
}

let setNavBar = () => {

  navBarControlsDiv.classList.remove("d-none")

  showCommitmentsButton.addEventListener("click", async (evt) => {
    commitments = await fetchCommitments()
    displayCommmitments(commitments)
  })

  createCommitmentButton.addEventListener("click", async (evt) => {

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

    mainStatusDiv.classList.add("d-none")
    createCommitment()
  })
}

const displayCommmitments = (commitments) => {

  commitmentDiv.classList.remove("d-none")
  causeCardDiv.classList.add("d-none")

  commitmentCardHeaderDiv.innerHTML = ""
  commitmentCardBodyDiv.innerHTML = ""
  commitmentCardFooterDiv.innerHTML = ""

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
  const commitmentHeaderFundDonated = document.createElement("th")
  const commitmentHeaderFundGoal = document.createElement("th")

  const commitmentHeaderHourAmount = document.createElement("th")
  const commitmentHeaderHourRecurring = document.createElement("th")
  const commitmentHeaderHourDonated = document.createElement("th")
  const commitmentHeaderHourGoal = document.createElement("th")

  commitmentHeaderCause.innerText = "Cause"
  commitmentHeaderStatus.innerText = "Status"
  commitmentHeaderStartDate.innerText = "Start"
  commitmentHeaderEndDate.innerText = "End"

  commitmentHeaderFundAmount.innerText = "$"
  commitmentHeaderFundRecurring.innerText = "REC"
  commitmentHeaderFundDonated.innerText = "Total ($)"
  commitmentHeaderFundGoal.innerText = "Goal"

  commitmentHeaderHourAmount.innerText = "Hour"
  commitmentHeaderHourRecurring.innerText = "REC"
  commitmentHeaderHourDonated.innerText = "Total"
  commitmentHeaderHourGoal.innerText = "Goal"

  commitmentHeaderCause.scope = "col"
  commitmentHeaderStatus.scope = "col"
  commitmentHeaderStartDate.scope = "col"
  commitmentHeaderEndDate.scope = "col"

  commitmentHeaderFundAmount.scope = "col"
  commitmentHeaderFundRecurring.scope = "col"
  commitmentHeaderFundDonated.scope = "col"
  commitmentHeaderFundGoal.scope = "col"

  commitmentHeaderHourAmount.scope = "col"
  commitmentHeaderHourRecurring.scope = "col"
  commitmentHeaderHourDonated.scope = "col"
  commitmentHeaderHourGoal.scope = "col"

  tableHeaderRow.append(
    commitmentHeaderCause,
    commitmentHeaderStatus,
    commitmentHeaderStartDate,
    commitmentHeaderEndDate,
    commitmentHeaderFundAmount,
    commitmentHeaderFundRecurring,
    commitmentHeaderFundDonated,
    commitmentHeaderFundGoal,
    commitmentHeaderHourAmount,
    commitmentHeaderHourRecurring,
    commitmentHeaderHourDonated,
    commitmentHeaderHourGoal
  )

  commitments.forEach(commitment => {

    const tableRow = document.createElement("tr")
    tableRow.scope = "row"

    const cellName = document.createElement("td")
    cellName.innerText = commitment.cause.name
    cellName.addEventListener("click", (evt) => {
      displayCommitment(commitment)
    })

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

    const cellFundDonated = document.createElement("td")
    cellFundDonated.innerText = commitment.fund_donated

    const cellFundGoal = document.createElement("td")
    cellFundGoal.innerText = commitment.fund_goal


    const cellHourAmount = document.createElement("td")
    cellHourAmount.innerText = commitment.hour_amount

    const cellHourRecurring = document.createElement("td")
    cellHourRecurring.innerText = commitment.hour_recurring

    const cellHourDonated = document.createElement("td")
    cellHourDonated.innerText = commitment.hour_donated

    const cellHourGoal = document.createElement("td")
    cellHourGoal.innerText = commitment.hour_goal

    tableRow.append(
      cellName,
      cellStatus,
      cellStartDate,
      cellEndDate,
      cellFundAmount,
      cellFundRecurring,
      cellFundDonated,
      cellFundGoal,
      cellHourAmount,
      cellHourRecurring,
      cellHourDonated,
      cellHourGoal
    )

    tableBody.append(tableRow)
  })

  tableHeader.append(tableHeaderRow)
  table.append(tableHeader)
  table.append(tableBody)

  commitmentCardBodyDiv.append(table)
}

let logOut = () => {
  commitmentDiv.classList.add("d-none")
  paymentCardDiv.classList.add("d-none")
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
      navBarControlsDiv.classList.remove("d-none")
      showUserInformation(currentUser)
    } else {
      showUserLoginError(response)
    }

  })