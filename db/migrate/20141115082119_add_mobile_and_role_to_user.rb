class AddMobileAndRoleToUser < ActiveRecord::Migration
  def change
    add_column :users, :mobile, :string
    add_column :users, :is_admin, :boolean, default: false
  end
end
