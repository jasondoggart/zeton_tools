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

  def reporting_days_array
    (self.project_start_date.to_datetime..self.project_end_date.to_datetime).to_a.select { |k| k.wday == 4 }
  end


  def instrument_metrics_report
    reporting_days = self.reporting_days_array
    empty_array = []
    reporting_days.length.times do
      empty_array.push(0)
    end
    report = Hash.new
    Instrument.metrics_attributes.each do |attr|
      report[attr.to_sym] = empty_array.dup
    end
    report.each do |key, array|
      counter = 0
      completed = self.instruments.where(key => 1)
      completed.each do |item|
        empty_array.each do |i|
          if counter == 0
            if (self.project_start_date.to_datetime...reporting_days[0].to_datetime).
                include?(item["#{key.to_s}_completed_at"])
              report[key][counter] += 1
            end
          else
            if (reporting_days[counter-1].to_datetime...reporting_days[counter].to_datetime).include?(item["#{key.to_s}_completed_at"])
              report[key][counter] += 1
            end
          end
          counter += 1
        end
        counter = 0
      end
    end
    report
  end

end
