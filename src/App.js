import React, { useState, useEffect } from 'react';
import '@aws-amplify/ui-react/styles.css'
import {
  withAuthenticator,
  Flex,
  Button,
  Heading,
  Text,
  TextField,
  View

} from '@aws-amplify/ui-react'
import { API } from 'aws-amplify';
import { listNotes } from './graphql/queries';
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation
} from './graphql/mutations';


function App({ signOut, user }) {
  const [notes, setNotes] = useState([])

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const apiData = await API.graphql({ query: listNotes})
    const notesFromAPI = apiData.data.listNotes.items;
    setNotes(notesFromAPI);
  }

  const createNote = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = {
      name: form.get('name'),
      description: form.get('description')
    };
    await API.graphql({
      query: createNoteMutation,
      variables: {input: data}
    });
    fetchNotes();
    e.target.reset();
  }

  const deleteNote = async ({ id }) => {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
    await API.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } }
    });
  }




  return (
    <View className="App">
        <Heading level={1}>My Notes APP</Heading>
            <View as='form' margin='3rem 0' onSubmit={createNote}>
              <Flex direction='row' justifyContent='center'>
                <TextField
                  name='name'
                  placeholder='Note Name'
                  label='Note Name'
                  labelHidden
                  variation='quiet'
                  required
                />
                <TextField
                  name='description'
                  placeholder='Note Description'
                  label='Note Name'
                  labelHidden
                  variation='quiet'
                  required
              />
              <Button type='submit' variation='primary'>
                Create Note
              </Button>
              </Flex>
            </View>
          <Heading level={2}>Current Notes</Heading>
            <View margin='3rem 0'>
                {notes.map((note) => (
                  <Flex
                    key={note.id || note.name}
                    direction='row'
                    justifyContent='center'
                    alignContent='center'
                    >
                      <Text as='strong' fontWeight={700}>
                        {note.name}
                      </Text>
                      <Text as='span'>{note.description}</Text>
                      <Button variation='link' onClick={() => deleteNote(note)}>
                        Delete note
                      </Button>
                    </Flex>
                ))}
            </View>
      <Button onClick={signOut}>Sign Out</Button>
    </View>
  );
}

export default  withAuthenticator(App);
