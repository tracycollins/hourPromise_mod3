class CreatePayments < ActiveRecord::Migration[6.0]
  def change
    create_table :payments do |t|
      t.date :date
      t.integer :fund_amount
      t.integer :hour_amount
      t.integer :user_id
      t.integer :commitment_id

      t.timestamps
    end
  end
end
