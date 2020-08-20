class CreateCommitments < ActiveRecord::Migration[6.0]
  def change
    create_table :commitments do |t|

      t.date :fund_start_date
      t.date :fund_end_date
      t.integer :fund_goal, default: 0
      t.integer :fund_amount, default: 0
      t.integer :fund_donated, default: 0
      t.boolean :fund_recurring, default: true

      t.date :hour_start_date
      t.date :hour_end_date
      t.integer :hour_goal, default: 0
      t.integer :hour_amount, default: 0
      t.integer :hour_donated, default: 0
      t.boolean :hour_recurring, default: true
      
      t.string :status, default: "open"
      t.integer :user_id
      t.integer :cause_id

      t.timestamps
    end
  end
end
