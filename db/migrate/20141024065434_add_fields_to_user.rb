class AddFieldsToUser < ActiveRecord::Migration
  def change
    add_column User, :nickname, :string
    add_column User, :provider, :string
    add_column User, :url, :string
    add_column User, :username, :string
    add_column User, :photo, :string
  end
end
