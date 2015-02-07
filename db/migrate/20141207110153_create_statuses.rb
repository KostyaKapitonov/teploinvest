class CreateStatuses < ActiveRecord::Migration
  def change
    create_table :statuses do |t|
      t.string :name
      t.string :title

      t.timestamps null: false
    end

    add_column :carts, :status_title, :string, default: 'pending'
  end
end
