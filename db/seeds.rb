# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
require 'get_org_info'
include GetOrgInfo

statuses = ["open", "active", "cancelled", "funded"]

puts "Deleting all DB instances..."

Payment.destroy_all
Commitment.destroy_all
Cause.destroy_all
User.destroy_all
Org.destroy_all

num_orgs = 7
num_individuals = 9
num_causes = 23
num_commitments = 10
num_payments = 17

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

  cause_start_date = Faker::Date.between(from: '2020-01-01', to: '2020-08-19')
  cause_end_date = Faker::Date.between(from: cause_start_date, to: '2025-12-31')

  Cause.create({
    description: Faker::Hacker.say_something_smart,
    name: Faker::Company.bs.capitalize,
    start_date: cause_start_date,
    end_date: cause_end_date,
    fund_target: rand(1..147_174),
    hour_target: rand(1..357),
    status: statuses.sample,
    org: @orgs_array.sample,
  })

end

puts "Generating #{num_commitments} Commitments ..."

num_commitments.times do |index|

  cause = Cause.all.sample
  user = User.all.sample

  fund_recurring = [true, false].sample

  fund_start_date = Faker::Date.between(from: cause.start_date, to: cause.end_date)
  fund_end_date = Faker::Date.between(from: fund_start_date, to: cause.end_date)
  fund_amount = rand(123..456)

  if fund_recurring
   fund_goal = rand(fund_amount..10_000)
  else
   fund_end_date = fund_start_date
   fund_goal = fund_amount
  end
  
  hour_recurring = [true, false].sample

  hour_start_date = Faker::Date.between(from: cause.start_date, to: cause.end_date)
  hour_end_date = Faker::Date.between(from: hour_start_date, to: cause.end_date)
  hour_amount = rand(1..40)

  if hour_recurring
   hour_goal = rand(hour_amount..500)
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
    fund_recurring: fund_recurring,

    hour_start_date: hour_start_date,
    hour_end_date: hour_end_date,
    hour_goal: hour_goal,
    hour_amount: hour_amount,
    hour_donated: 0,
    hour_recurring: true,

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
