class AddCurrentValuteRate < ActiveRecord::Migration
  def change
    add_column :settings, :usd_rate, :float, :precision => 8, :scale => 4
  end
end
