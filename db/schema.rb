# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_08_17_173942) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "causes", force: :cascade do |t|
    t.string "name"
    t.string "owner"
    t.string "description"
    t.integer "fund_target", default: 0
    t.integer "fund_donated", default: 0
    t.integer "hour_target", default: 0
    t.integer "hour_donated", default: 0
    t.date "start_date"
    t.date "end_date"
    t.string "status", default: "open"
    t.integer "org_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "commitments", force: :cascade do |t|
    t.date "fund_start_date"
    t.date "fund_end_date"
    t.integer "fund_goal", default: 0
    t.integer "fund_amount", default: 0
    t.integer "fund_donated", default: 0
    t.boolean "fund_recurring", default: true
    t.date "hour_start_date"
    t.date "hour_end_date"
    t.integer "hour_goal", default: 0
    t.integer "hour_amount", default: 0
    t.integer "hour_donated", default: 0
    t.boolean "hour_recurring", default: true
    t.string "status", default: "open"
    t.integer "user_id"
    t.integer "cause_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "orgs", force: :cascade do |t|
    t.string "name"
    t.string "tagline"
    t.string "info"
    t.string "address"
    t.string "interests"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "payments", force: :cascade do |t|
    t.date "date"
    t.integer "fund_amount", default: 0
    t.integer "hour_amount", default: 0
    t.integer "user_id"
    t.integer "commitment_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "username"
    t.string "address"
    t.string "bio"
    t.string "interests"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

end
