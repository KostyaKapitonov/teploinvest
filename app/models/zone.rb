class Zone < ActiveRecord::Base
  has_many :carts

  #before_save :validate_zones

  def self.create_or_update(params)
    new_zones =[]
    success = false
    Zone.transaction do
      (params[:new_zones]||[]).each do |nz|
        new_zones << Zone.new(nz.permit(:name,:color,:price, :free_if_sum))
      end
      (params[:existed_zones]||[]).each do |ez|
        Zone.update(ez[:id],ez.permit(:name,:color,:price, :free_if_sum))
      end
      new_zones.each(&:save!)
      success = true
    end
    success
  end

  private

  def validate_zones
    self.free_if_sum = self.free_if_sum.to_f
    self.free_if_sum.blank? || (!self.free_if_sum.blank? && self.free_if_sum > 0)
  end

end
