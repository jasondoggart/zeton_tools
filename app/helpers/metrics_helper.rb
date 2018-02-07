module MetricsHelper

  # Instrument metrics
  
  def total_instrument_count
    current_project.instruments.count
  end

  def datasheet_submitted_for_approval_required
    not_required = current_project.instruments.where(datasheet_submitted_for_approval: 2).count
    return total_instrument_count - not_required
  end

  def datasheet_submitted_for_approval_complete
    current_project.instruments.where(datasheet_submitted_for_approval: 1).count
  end

  def datasheet_approved_required
  end

  def datasheet_required_complete
  end

end
