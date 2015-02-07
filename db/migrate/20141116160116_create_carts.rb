class CreateCarts < ActiveRecord::Migration
  def change
    create_table :carts do |t|
      t.integer :user_id
      t.float :usd_rate, default: 0.0
      t.float :delivery_price, default: 0.0
      t.float :total_price, default: 0.0
      t.boolean :confirmed, default: false
      t.string :status, default: 'pending' # 'in process' 'completed'

      t.timestamps null: false
    end
  end
end
