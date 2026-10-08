const handleSubmit = (e) => {
    e.preventDefault();
    const cleanText = text.trim();

    // Validate empty or all-whitespace submissions
    if (!cleanText) return;

    // Create new confession object
    const newConfession = {
      key: `confession-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: cleanText,
      timestamp: new Date()
    };

    // Submit is active only if there is non-whitespace text
  const isFormValid = text.trim().length > 0 && charCount <= 280;

    This is the function that handles submission, my prediction about the submission check is that the if the empty check submission is removed, empty submissions will be added to the feed, however I the submit was still not active after removing the empty check submission function and running it, the isFormValid was still false, so the submit button will still be disabled. Therefore the change should be in the isFormValid variable and not only the empty check submission.