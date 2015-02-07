class DelStatusTitleFromCart < ActiveRecord::Migration
  def change
    remove_column :carts, :status_title
  end
end
