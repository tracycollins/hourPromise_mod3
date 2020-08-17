class CreateCauses < ActiveRecord::Migration[6.0]
  def change
    create_table :causes do |t|
      t.string :name
      t.string :owner
      t.string :description
      t.integer :fund_target
      t.integer :hour_target
      t.date :start_date
      t.date :end_date
      t.string :status

      t.timestamps
    end
  end
end
