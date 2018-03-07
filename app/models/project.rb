class Project < ApplicationRecord
  validates_presence_of :project_number, :project_name, :client
  has_many :equipment
  has_many :instruments
  has_many :information_requests
  has_many :team_members
  has_many :users, through: :team_members
  has_many :documents
  has_many :handvalves
  has_many :action_items
  has_many :client_team_members
  has_many :client_documents
  belongs_to :user
  after_create :initialize_team_members



  def initialize_team_members
    self.team_members.create(role: "Project Manager", user: user)
  end

end
