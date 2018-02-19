class AddDefaultToRfisAnswered < ActiveRecord::Migration[5.1]
  def change
    change_column_default(:information_requests, :answered, 0)
  end
end
