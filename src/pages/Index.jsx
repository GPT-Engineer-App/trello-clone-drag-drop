import React, { useState } from "react";
import { Container, Box, VStack, HStack, Text, Input, Button, IconButton } from "@chakra-ui/react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";

const initialColumns = {
  backlog: {
    name: "Backlog",
    items: [
      { id: "1", content: "As a user I want to create new account and delete my blog posts." },
      { id: "2", content: "As an User I want to create my personal account." },
    ],
  },
  designSprint: {
    name: "DESIGN SPRINT #7",
    items: [
      { id: "3", content: "Design for the landing page" },
      { id: "4", content: "Design for the My Account section" },
    ],
  },
  devSprint: {
    name: "DEV SPRINT #13",
    items: [
      { id: "5", content: "As a user I want to be able to create new posts from My Dashboard" },
      { id: "6", content: "As an administrator I want to be able to manage my users." },
    ],
  },
  accepted: {
    name: "Accepted",
    items: [
      { id: "7", content: "As a user I want to be able to send a message" },
      { id: "8", content: "As an administrator I want to be able to login, create new account, delete account or merge few accounts together." },
    ],
  },
};

const Index = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [editingCard, setEditingCard] = useState(null);
  const [editContent, setEditContent] = useState("");

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  const handleEdit = (columnId, itemId) => {
    setEditingCard({ columnId, itemId });
    const column = columns[columnId];
    const item = column.items.find((item) => item.id === itemId);
    setEditContent(item.content);
  };

  const handleSave = () => {
    const { columnId, itemId } = editingCard;
    const column = columns[columnId];
    const items = column.items.map((item) =>
      item.id === itemId ? { ...item, content: editContent } : item
    );
    setColumns({
      ...columns,
      [columnId]: {
        ...column,
        items,
      },
    });
    setEditingCard(null);
    setEditContent("");
  };

  const handleCancel = () => {
    setEditingCard(null);
    setEditContent("");
  };

  return (
    <Container maxW="container.xl" p={4}>
      <DragDropContext onDragEnd={onDragEnd}>
        <HStack spacing={4} align="start">
          {Object.entries(columns).map(([columnId, column]) => (
            <Box key={columnId} w="full" bg="gray.100" p={4} borderRadius="md">
              <Text fontSize="xl" mb={4}>
                {column.name}
              </Text>
              <Droppable droppableId={columnId}>
                {(provided) => (
                  <VStack
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    spacing={4}
                    minH="200px"
                  >
                    {column.items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            bg="white"
                            p={4}
                            borderRadius="md"
                            w="full"
                            boxShadow="md"
                          >
                            {editingCard && editingCard.itemId === item.id ? (
                              <>
                                <Input
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  mb={2}
                                />
                                <HStack>
                                  <IconButton
                                    icon={<FaSave />}
                                    onClick={handleSave}
                                    aria-label="Save"
                                  />
                                  <IconButton
                                    icon={<FaTimes />}
                                    onClick={handleCancel}
                                    aria-label="Cancel"
                                  />
                                </HStack>
                              </>
                            ) : (
                              <>
                                <Text>{item.content}</Text>
                                <IconButton
                                  icon={<FaEdit />}
                                  onClick={() => handleEdit(columnId, item.id)}
                                  aria-label="Edit"
                                  size="sm"
                                  mt={2}
                                />
                              </>
                            )}
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </VStack>
                )}
              </Droppable>
              <Button mt={4} w="full">
                Add new ticket...
              </Button>
            </Box>
          ))}
        </HStack>
      </DragDropContext>
    </Container>
  );
};

export default Index;