class AddVkIdToUser < ActiveRecord::Migration
  def change
    add_column :users, :vk_id, :string
  end
end
