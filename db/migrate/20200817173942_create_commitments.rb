class CreateCommitments < ActiveRecord::Migration[6.0]
  def change
    create_table :commitments do |t|

      t.date :fund_start_date
      t.date :fund_end_date
      t.integer :fund_goal
      t.integer :fund_amount
      t.integer :fund_donated
      t.boolean :fund_recurring

      t.date :hour_start_date
      t.date :hour_end_date
      t.integer :hour_goal
      t.integer :hour_amount
      t.integer :hour_donated
      t.boolean :hour_recurring
      
      t.string :status
      t.integer :user_id
      t.integer :cause_id

      t.timestamps
    end
  end
end
