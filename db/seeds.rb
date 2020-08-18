# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
require 'get_org_info'
include GetOrgInfo

statuses = ["active", "cancelled", "funded"]

puts "Deleting all DB instances..."

Payment.destroy_all
Commitment.destroy_all
Cause.destroy_all
User.destroy_all
Org.destroy_all

num_orgs = 2
num_individuals = 3
num_causes = 5
num_commitments = 6
num_payments = 10

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

  Cause.create({
    description: Faker::Hacker.say_something_smart,
    name: Faker::Company.bs.capitalize,
    start_date: Faker::Date.between(from: '2020-01-01', to: '2021-12-31'),
    end_date: Faker::Date.between(from: '2022-01-01', to: '2025-12-31'),
    fund_target: rand(1..147_174),
    hour_target: rand(1..357),
    status: statuses.sample,
    org: @orgs_array.sample,
  })

end

puts "Generating #{num_commitments} Commitments ..."

num_commitments.times do |index|

  Commitment.create({
    start_date: Faker::Date.between(from: '2020-01-01', to: '2021-12-31'),
    created_date: Faker::Date.between(from: '2020-01-01', to: '2021-12-31'),
    fund_amount: rand(1..123456),
    funds_donated: 0,
    fund_recurring: true,
    hour_amount: rand(1..54321),
    hour_recurring: true,
    hours_donated: 0,
    user: User.all.sample,
    cause: Cause.all.sample
  })

end

puts "Generating #{num_payments} Payments ..."

num_payments.times do |index|

  c = Commitment.all.sample

  p = Payment.create({
    date: Faker::Date.between(from: '2020-01-01', to: '2021-12-31'),
    fund_amount: rand(1..123456),
    hour_amount: rand(1..54321),
    user: c.user,
    commitment: c
  })

end

Commitment.create({
  start_date: Faker::Date.between(from: '2020-01-01', to: '2021-12-31'),
  created_date: Faker::Date.between(from: '2020-01-01', to: '2021-12-31'),
  fund_amount: rand(1..123456),
  funds_donated: 0,
  fund_recurring: true,
  hour_amount: rand(1..54321),
  hour_recurring: true,
  hours_donated: 0,
  user: User.first,
  cause: Cause.first
})


puts "SEED COMPLETE"
puts "-----------------"
puts "Users:       #{User.all.count}"
puts "Causes:      #{Cause.all.count}"
puts "Commitments: #{Commitment.all.count}"
puts "Orgs:        #{Org.all.count}"
puts "Payments:    #{Payment.all.count}"
