class CustomPage < ActiveRecord::Base

  def self.set_order(params)
    success = false
    CustomPage.transaction do
      CustomPage.all.each do |cp|
        params[:pages].each do |p|
          cp.update(seq: p[:seq]) if cp.id == p[:id]
        end
      end
      success = true
    end
    success
  end

end
