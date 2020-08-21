require 'get_org_info'
include GetOrgInfo

statuses = ["open", "funded", "cancelled"]

puts "Deleting all DB instances..."

Payment.destroy_all
Commitment.destroy_all
Cause.destroy_all
User.destroy_all
Org.destroy_all

num_orgs = 25
num_individuals = 8
num_causes = 40
num_commitments = 47
num_payments = 0

User.create([
  {
      name: 'Tracy',
      username: 'threecee',
      address: 'Brooklyn',
      bio: 'I love my bike'
  },
  {
      name: 'Alvee',
      username: 'alveem',
      address: 'Queens',
      bio: 'I love my camera'
  }
])

# Get rated orgs from Charity Navigator API
# https://charity.3scale.net/

puts "Generating #{num_orgs} Orgs ..."
orgs = get_rated_orgs(num_orgs)  # defaults to 10 orgs requested.  include integer arg to diff number to return

@orgs_array = []

if orgs

  orgs.each do |org|
    address = org["mailingAddress"]["city"] + " " + org["mailingAddress"]["stateOrProvince"]
    new_org = Org.create({
      name: org["charityName"],
      address: address,
      tagline: org["tagLine"]
    })
    @orgs_array << new_org
    
  end  
end  

puts "Generating #{num_individuals} Individuals ..."

num_individuals.times do |index|

  name = Faker::Name.unique.name
  address = Faker::Address.city + " " + Faker::Address.state_abbr

  new_individual = User.create({
    name: name,
    username: Faker::Internet.unique.username,
    address: address,
    bio: Faker::Quote.famous_last_words
  })  

end  

puts "Generating #{num_causes} Causes ..."

num_causes.times do |index|

  cause_start_date = Faker::Date.between(from: '2020-01-01', to: '2020-09-01')
  cause_end_date = Faker::Date.between(from: '2025-12-31', to: '2030-12-31')

  Cause.create({
    description: Faker::Hacker.say_something_smart,
    name: Faker::Company.bs.capitalize,
    start_date: cause_start_date,
    end_date: cause_end_date,
    fund_goal: rand(1..10_000),
    hour_goal: rand(1..10_000),
    fund_status: "open",
    hour_status: "open",
    status: "open",
    org: @orgs_array.sample,
  })

end

puts "Generating #{num_commitments} Commitments ..."

num_commitments.times do |index|

  cause = Cause.all.sample
  user = User.all.sample

  # fund_recurring = [true, false].sample
  fund_recurring = true

  fund_start_date = Faker::Date.between(from: cause.start_date, to: cause.end_date)
  fund_end_date = Faker::Date.between(from: fund_start_date, to: cause.end_date)
  fund_amount = rand(13..47)

  if fund_recurring
   fund_goal = rand(2_000..10_000)
  else
   fund_end_date = fund_start_date
   fund_goal = fund_amount
  end
  
  # hour_recurring = [true, false].sample
  hour_recurring = true

  hour_start_date = Faker::Date.between(from: cause.start_date, to: cause.end_date)
  hour_end_date = Faker::Date.between(from: hour_start_date, to: cause.end_date)
  hour_amount = rand(1..40)

  if hour_recurring
   hour_goal = rand(1_000..5_000)
  else
   hour_end_date = hour_start_date
   hour_goal = hour_amount
  end
  
  
  Commitment.create({

    fund_start_date: fund_start_date,
    fund_end_date: fund_end_date,
    fund_goal: fund_goal,
    fund_amount: fund_amount,
    fund_donated: 0,
    fund_recurring: true,
    fund_status: "open",

    hour_start_date: hour_start_date,
    hour_end_date: hour_end_date,
    hour_goal: hour_goal,
    hour_amount: hour_amount,
    hour_donated: 0,
    hour_recurring: true,
    hour_status: "open",

    status: "open",
    user: User.all.sample,
    cause: cause
  })

end

puts "Generating #{num_payments} Payments ..."

num_payments.times do |index|

  c = Commitment.all.sample

  if [true, false].sample
    Payment.create({
      date: Faker::Date.between(from: c.fund_start_date, to: c.fund_end_date),
      fund_amount: c.fund_amount,
      user: c.user,
      commitment: c
    })
  else
    Payment.create({
      date: Faker::Date.between(from: c.hour_start_date, to: c.hour_end_date),
      hour_amount: c.hour_amount,
      user: c.user,
      commitment: c
    })
  end

end

puts "SEED COMPLETE"
puts "-----------------"
puts "Users:       #{User.all.count}"
puts "Causes:      #{Cause.all.count}"
puts "Commitments: #{Commitment.all.count}"
puts "Orgs:        #{Org.all.count}"
puts "Payments:    #{Payment.all.count}"
