class AddFieldFirmIdToProduct < ActiveRecord::Migration
  def change
    add_column :products, :firm_id, :integer
  end
end
