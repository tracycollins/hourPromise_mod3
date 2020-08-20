class CreateCauses < ActiveRecord::Migration[6.0]
  def change
    create_table :causes do |t|
      t.string :name
      t.string :owner
      t.string :description
      t.integer :fund_target, default: 0
      t.integer :fund_donated, default: 0
      t.integer :hour_target, default: 0
      t.integer :hour_donated, default: 0
      t.date :start_date
      t.date :end_date
      t.string :status, default: "open"
      t.integer :org_id

      t.timestamps
    end
  end
end
