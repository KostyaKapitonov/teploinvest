class AddConfDateToCart < ActiveRecord::Migration
  def change
    add_column :carts, :confirmation_date, :datetime
  end
end
