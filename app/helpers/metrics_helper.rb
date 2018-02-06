module MetricsHelper

  # Instrument metrics
  
  def total_instrument_count
    current_project.instruments.count
  end

end
