class ProjectInstrumentImport
  include ActiveModel::Model
  require 'roo'

  attr_accessor :file, :project

  def initialize(attributes={})
    attributes.each { |name, value| send("#{name}=", value) }
  end

  def persisted?
    false
  end

  def save
    if imported_project_instruments.map(&:valid?).all?
      imported_project_instruments.each(&:save!)
      true
    else
      imported_project_instruments.each_with_index do |inst, index|
        inst.errors.full_messages.each do |msg|
          errors.add :base, "Row #{index + 2}: #{msg}"
        end
      end
      false
    end
  end

  def imported_project_instruments
    @imported_project_instruments ||= load_imported_project_instruments
  end

  def load_imported_project_instruments
    spreadsheet = open_spreadsheet
    header = spreadsheet.row(2)
    (3..spreadsheet.last_row).map do |i|
      row = Hash[[header, spreadsheet.row(i)].transpose]
      instrument = Instrument.find_by_id(row["id"]) || Instrument.new
      instrument.attributes = row.to_hash
      instrument.project_id = project
      instrument
    end
  end

  def open_spreadsheet
    case File.extname(file.original_filename)
    when ".csv" then Csv.new(file.path, nil, :ignore)
    when ".xls" then Roo::Excel.new(file.path, nil, :ignore)
    when ".xlsx" then Roo::Excelx.new(file.path)
    else raise "Unknown file type: #{file.original_filename}"
    end
  end
end
