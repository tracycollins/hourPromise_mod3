class CreateCauses < ActiveRecord::Migration[6.0]
  def change
    create_table :causes do |t|
      t.integer :org_id
      t.string :name
      t.string :owner
      t.string :description

      t.integer :fund_goal, default: 0
      t.integer :fund_donated, default: 0
      t.string :fund_status, default: "open"

      t.integer :hour_goal, default: 0
      t.integer :hour_donated, default: 0
      t.string :hour_status, default: "open"

      t.date :start_date
      t.date :end_date

      t.string :status, default: "open"

      t.timestamps
    end
  end
end
