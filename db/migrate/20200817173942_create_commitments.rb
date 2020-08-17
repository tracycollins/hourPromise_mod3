class CreateCommitments < ActiveRecord::Migration[6.0]
  def change
    create_table :commitments do |t|
      t.date :created_date
      t.date :start_date
      t.integer :fund_amount
      t.boolean :fund_recurring
      t.integer :funds_donated
      t.integer :hour_amount
      t.boolean :hour_recurring
      t.integer :hours_donated
      t.string :status
      t.integer :user_id
      t.integer :cause_id

      t.timestamps
    end
  end
end
