class ActionItem < ApplicationRecord
  validates_presence_of :area, :title, :description
  belongs_to :project
  has_and_belongs_to_many :instruments
  has_and_belongs_to_many :equipment
  has_and_belongs_to_many :handvalves


  def ai_number
    'ZET-AI-' + id.to_s
  end
end
