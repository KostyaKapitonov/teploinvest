class UserChangeFields < ActiveRecord::Migration
  def change
    remove_column :users, :nickname
    remove_column :users, :photo
    remove_column :users, :provider
    remove_column :users, :username
    remove_column :users, :vk_id

    rename_column :users, :url, :identity

    add_column :users, :first_name, :string
    add_column :users, :last_name, :string
    add_column :users, :father_name, :string
    add_column :users, :address, :string
  end
end
